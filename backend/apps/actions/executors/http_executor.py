import requests


class HttpExecutor:

    @staticmethod
    def execute(step):

        config = step.configuration

        response = requests.request(
            method=config.get("method", "GET"),
            url=config.get("url"),
            json=config.get("body"),
            timeout=30,
        )

        if response.status_code >= 400:
            raise Exception(
                f"HTTP {response.status_code}"
            )

        return response.status_code