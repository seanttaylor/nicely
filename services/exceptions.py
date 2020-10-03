#Post
class PostServiceError(Exception):
    _messages = {
        "PostCharacterLimitExceeded": "ValidationError: Post body must be (150) characters or less",
        "InvalidUserId": "ValidationError: {} is not a valid user id",
        "MissingUserId": "ValidationError: cannot find 'user_id' of post",
        "InvalidPostBody": "ValidationError: cannot find 'body' of post",
        "ServiceError": "ValidationFailure: The Sentiment Service returned a {} response"
    };

    def __init__(self, **kwargs):
        self._error_type = kwargs["error_type"];
        self._error_data = kwargs;

    def __str__(self):
        if self._error_type in self._messages:
            return "PostServiceError.{} {}".format(self._error_type, self._messages[self._error_type]);
        else:
            return "Unspecified PostServiceError raised";

#Comments


#User

