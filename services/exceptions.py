###PostService###
class PostServiceError(Exception):
    _messages = {
        "PostCharacterLimitExceeded": "ValidationError: Post body must be (150) characters or less",
        "MissingOrInvalidUserId": "ValidationError: 'user_id' of post is missing or invalid",
        "MissingOrInvalidPostBody": "ValidationError: 'body' of post is missing or invalid",
        "PostDataEmpty": "Validation Error: cannot create post; no arguments given",
        "InsufficientPostSentimentScore": "ValidationFailure: The Sentiment Service returned a {} response"
    };

    def __init__(self, **kwargs):
        self._error_type = kwargs["error_type"];
        self._error_data = kwargs;

    def __str__(self):
        if self._error_type in self._messages:
            return "PostServiceError.{} {}".format(self._error_type, self._messages[self._error_type]);
        else:
            return "Unspecified PostServiceError raised";


###CommentService###
class CommentServiceError(Exception):
    _messages = {
        "MissingOrInvalidUserId": "ValidationError: 'user_id' of comment is missing or invalid",
        "MissingOrInvalidPostId": "ValidationError: 'post_id' of comment is missing or invalid",
        "MissingOrInvalidCommentBody": "ValidationError: 'body' of comment is missing or invalid",
        "InsufficientCommentSentimentScore": "ValidationFailure: The Sentiment Service returned a {} response"
    };

    def __init__(self, **kwargs):
        self._error_type = kwargs["error_type"];
        self._error_data = kwargs;

    def __str__(self):
        if self._error_type in self._messages:
            return "CommentServiceError.{} {}".format(self._error_type, self._messages[self._error_type]);
        else:
            return "Unspecified CommentServiceError raised";


###UserService###
class UserServiceError(Exception):
    _messages = {
        "MissingOrInvalidEmail": "ValidationError: 'email_address' of user is missing or invalid",
        "MissingOrInvalidPhone": "ValidationError: 'phone_number' of user is missing or invalid",
        "MissingOrInvalidFirstName": "ValidationError: 'first_name' of user missing or invalid",
        "MissingOrInvalidLastName": "ValidationError: 'last_name' of user is missing or invalid",
        "MissingOrInvalidHandle": "ValidationError: 'handle' of user is missing or invalid",
        "UserDataEmpty": "ValidationError: cannot create user; no arguments given"
    };

    def __init__(self, **kwargs):
        self._error_type = kwargs["error_type"];
        self._error_data = kwargs;

    def __str__(self):
        if self._error_type in self._messages:
            return "UserServiceError.{} {}".format(self._error_type, self._messages[self._error_type]);
        else:
            return "Unspecified UserServiceError raised";

