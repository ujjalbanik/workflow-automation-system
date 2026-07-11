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

        print(response.status_code)