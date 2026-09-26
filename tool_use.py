from __future__ import annotations

import re
from decimal import Decimal, InvalidOperation
from typing import Any
from urllib.parse import urlparse


class ToolValidationError(ValueError):
    pass


CALCULATOR_PATTERN = re.compile(
    r"\s*(?P<left>-?\d{1,18}(?:\.\d{1,18})?)\s*"
    r"(?P<operator>[+\-−×x*/])\s*"
    r"(?P<right>-?\d{1,18}(?:\.\d{1,18})?)\s*"
)
TOOL_PARAMETERS = {
    "calculator.evaluate": {"expression": str},
    "wikipedia.search": {"query": str, "language": str},
}


class ToolUseAgent:
    def validate_request(self, request: Any) -> dict[str, Any]:
        if not isinstance(request, dict):
            raise ToolValidationError("Tool request must be a JSON object.")
        tool_name = request.get("tool")
        if tool_name not in TOOL_PARAMETERS:
            raise ToolValidationError("Unknown tool/API name.")
        parameters = request.get("parameters")
        if not isinstance(parameters, dict):
            raise ToolValidationError("Tool parameters must be a JSON object.")
        schema = TOOL_PARAMETERS[tool_name]
        missing = set(schema) - set(parameters)
        extra = set(parameters) - set(schema)
        if missing:
            raise ToolValidationError(f"Missing required parameter(s): {', '.join(sorted(missing))}.")
        if extra:
            raise ToolValidationError(f"Unexpected parameter(s): {', '.join(sorted(extra))}.")
        for key, expected_type in schema.items():
            if type(parameters[key]) is not expected_type:
                raise ToolValidationError(f"Parameter '{key}' must be a {expected_type.__name__}.")
        if tool_name == "calculator.evaluate":
            expression = parameters["expression"]
            if len(expression) > 100 or not CALCULATOR_PATTERN.fullmatch(expression):
                raise ToolValidationError("Calculator accepts one bounded arithmetic expression only.")
        else:
            query = parameters["query"].strip()
            if not query or len(query) > 300:
                raise ToolValidationError("Wikipedia query must contain 1 to 300 characters.")
            if parameters["language"] not in {"en", "te", "hi", "ta", "kn", "ml"}:
                raise ToolValidationError("Unsupported Wikipedia language.")
        return {"tool": tool_name, "parameters": parameters}

    def validate_error_response(self, tool_name: str, response: Any) -> dict[str, Any]:
        """Validate structured tool/API failures instead of treating arbitrary errors as data."""
        if tool_name not in TOOL_PARAMETERS:
            raise ToolValidationError("Unknown tool/API name.")
        if not isinstance(response, dict):
            raise ToolValidationError("Tool error response must be a JSON object.")
        error = response.get("error")
        if not isinstance(error, dict):
            raise ToolValidationError("Tool error response must contain an error object.")
        if type(error.get("code")) is not str or type(error.get("message")) is not str:
            raise ToolValidationError("Tool error schema requires string code and message.")
        if not error["code"].strip() or not error["message"].strip() or len(error["message"]) > 1000:
            raise ToolValidationError("Tool error code/message is invalid or too long.")
        return response

    def validate_response(self, tool_name: str, response: Any) -> Any:
        if tool_name == "calculator.evaluate":
            if not isinstance(response, dict) or type(response.get("value")) is not str:
                raise ToolValidationError("Calculator response failed its result schema.")
            try:
                Decimal(response["value"])
            except InvalidOperation as error:
                raise ToolValidationError("Calculator returned a non-numeric result.") from error
            return response
        if tool_name == "wikipedia.search":
            if not isinstance(response, list) or len(response) > 4:
                raise ToolValidationError("Wikipedia response must be a list of at most four sources.")
            for source in response:
                if not isinstance(source, dict) or not all(type(source.get(key)) is str for key in ("title", "url", "snippet")):
                    raise ToolValidationError("Wikipedia source failed its required-field schema.")
                parsed = urlparse(source["url"])
                if parsed.scheme != "https" or not parsed.hostname or not (parsed.hostname == "wikipedia.org" or parsed.hostname.endswith(".wikipedia.org")):
                    raise ToolValidationError("Wikipedia source URL failed host validation.")
                if len(source["snippet"]) > 1400:
                    raise ToolValidationError("Wikipedia source snippet exceeds the allowed size.")
            return response
        raise ToolValidationError("Unknown tool/API name.")

    def validate_model_request(self, endpoint: Any, model: Any, prompt: Any) -> dict[str, str]:
        if type(endpoint) is not str or type(model) is not str or type(prompt) is not str:
            raise ToolValidationError("Model endpoint, name, and prompt must be strings.")
        parsed = urlparse(endpoint)
        loopback = parsed.hostname in {"localhost", "127.0.0.1", "::1"}
        if parsed.username or parsed.password or not parsed.hostname or not parsed.path:
            raise ToolValidationError("Model endpoint URL is malformed.")
        if parsed.scheme != "https" and not (parsed.scheme == "http" and loopback):
            raise ToolValidationError("Model endpoint must use HTTPS, except for loopback development endpoints.")
        if not model.strip() or len(model) > 120:
            raise ToolValidationError("Model name is required and must be at most 120 characters.")
        if not prompt.strip() or len(prompt) > 16000:
            raise ToolValidationError("Model prompt must contain 1 to 16000 characters.")
        return {"endpoint": endpoint, "model": model.strip(), "prompt": prompt}

    def validate_model_response(self, response: Any) -> str:
        if not isinstance(response, dict):
            raise ToolValidationError("Model response must be a JSON object.")
        choices = response.get("choices")
        if not isinstance(choices, list) or not choices or not isinstance(choices[0], dict):
            raise ToolValidationError("Model response is missing a valid choices array.")
        message = choices[0].get("message")
        if not isinstance(message, dict) or type(message.get("content")) is not str:
            raise ToolValidationError("Model response message failed its schema.")
        content = message["content"].strip()
        if not content or len(content) > 8000:
            raise ToolValidationError("Model response content is empty or exceeds the allowed size.")
        return content


class SandboxExecutor:
    """Restricted Decimal calculator; arbitrary Python/code execution is not supported."""

    def __init__(self, tool_agent: ToolUseAgent | None = None) -> None:
        self.tool_agent = tool_agent or ToolUseAgent()

    def execute(self, request: Any) -> dict[str, str]:
        validated = self.tool_agent.validate_request(request)
        if validated["tool"] != "calculator.evaluate":
            raise ToolValidationError("SandboxExecutor only executes the restricted calculator tool.")
        expression = validated["parameters"]["expression"]
        match = CALCULATOR_PATTERN.fullmatch(expression)
        if not match:
            raise ToolValidationError("Invalid arithmetic expression.")
        try:
            left = Decimal(match.group("left"))
            right = Decimal(match.group("right"))
            operator = match.group("operator").lower()
            operations = {
                "+": lambda: left + right,
                "-": lambda: left - right,
                "−": lambda: left - right,
                "×": lambda: left * right,
                "x": lambda: left * right,
                "*": lambda: left * right,
                "/": lambda: left / right,
            }
            value = operations[operator]()
        except (InvalidOperation, ZeroDivisionError, KeyError) as error:
            raise ToolValidationError("Arithmetic expression could not be evaluated.") from error
        normalized = format(value.normalize(), "f")
        response = {"expression": expression, "value": normalized}
        return self.tool_agent.validate_response("calculator.evaluate", response)
