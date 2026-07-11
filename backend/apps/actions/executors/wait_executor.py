import time


class WaitExecutor:
    @staticmethod
    def execute(step):
        config = step.configuration

        time.sleep(
            config.get("seconds", 5)
        )