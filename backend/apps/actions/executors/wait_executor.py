import time


class WaitExecutor:

    @staticmethod
    def execute(step):

        config = step.configuration

        seconds = config.get("seconds", 5)

        time.sleep(seconds)

        return seconds