####UserService Unit Tests####
import pytest;
import random;
from datetime import datetime;
from services.exceptions import UserServiceException;
from app_config.app import app_config;
from services.user import UserService, UserValidator, User;
from lib.repository.user.my_sql import UserMySQLRepository;
from tests.utils.utils import random_email_address, random_phone_number, random_user_handle

test_user_validator = UserValidator(app_config["users"]);
test_user_mysql_repo = UserMySQLRepository();
test_user_service = UserService(test_user_mysql_repo, test_user_validator);

####Tests####


def test_should_return_new_user_instance():
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_user.save();

    assert isinstance(test_user, User) == True;


def test_should_return_list_of_user_instances():
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );

    test_user.save();
    result = test_user_service.find_all_users();

    print(result[0])

    assert isinstance(result, list);
    assert isinstance(result[0], User) == True;


def test_should_delete_user():
    #delete_user FUNCTIONALITY NOT IMPLEMENTED YET
    assert True == True;


def test_should_return_user_id_on_save():
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_doc_id = test_user.save();

    assert isinstance(test_doc_id, str) == True;


def test_should_return_updated_user_first_name():
    test_first_name_edit = "Brucie";
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_doc_id = test_user.save();
    test_user.edit_name(first_name=test_first_name_edit);

    assert test_user._data["first_name"] == test_first_name_edit;


def test_should_return_updated_user_last_name():
    test_last_name_edit = "Banner M.D.";
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );

    test_user.save();
    test_user.edit_name(last_name=test_last_name_edit);

    assert test_user._data["last_name"] == test_last_name_edit;
    assert test_user._data["first_name"] == "Bruce";


def test_should_return_updated_user_motto():
    test_motto_edit = "Always be smashing";
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );

    test_user.save();
    test_user.edit_motto(test_motto_edit);

    assert test_user._data["motto"] == test_motto_edit;


def test_should_return_updated_user_phone_number():
    test_phone_number_edit = random_phone_number();
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );

    test_user.save();
    test_user.edit_phone_number(test_phone_number_edit);

    assert test_user._data["phone_number"] == test_phone_number_edit;


def test_should_return_false_when_user_does_not_exist_in_database():
    fake_user_id = str(datetime.now());

    assert test_user_service.user_exists(fake_user_id) == False;


def test_should_add_a_follower_to_an_existing_user():
    test_user_no_1 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_user_no_1.save();

    test_user_no_2 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Let's do this!",
        email_address=random_email_address(),
        first_name="Steve",
        last_name="Rogers",
        phone_number=random_phone_number()
    );
    test_user_no_2.save();
    test_user_no_2.follow_user(test_user_no_1);

    assert test_user_no_2.is_following(test_user_no_1) == True;


def test_should_return_a_list_of_followers():
    test_user_no_1 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_user_no_1.save();

    test_user_no_2 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Let's do this!",
        email_address=random_email_address(),
        first_name="Steve",
        last_name="Rogers",
        phone_number=random_phone_number()
    );
    test_user_no_2.save();
    test_user_no_2.follow_user(test_user_no_1);
    followers_list = test_user_no_1.get_followers();

    assert type(followers_list) == list;
    assert isinstance(followers_list[0], User);
    assert len(followers_list) == 1;

def test_should_return_a_list_of_users_a_specified_user_follows():
    ###PICKUP HERE###WRITE TESTS###
    test_user_no_1 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Hulk smash!",
        email_address=random_email_address(),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_user_no_1_id = test_user_no_1.save();

    test_user_no_2 = test_user_service.create_user(
        handle=random_user_handle(),
        motto="Let's do this!",
        email_address=random_email_address(),
        first_name="Steve",
        last_name="Rogers",
        phone_number=random_phone_number()
    );
    test_user_no_2.save();
    test_user_no_2.follow_user(test_user_no_1);
    users_followed_list = test_user_no_2.follows();

    assert type(users_followed_list) == list;
    assert isinstance(users_followed_list[0], User);
    assert len(users_followed_list) == 1;
    assert users_followed_list[0]._id == test_user_no_1_id;


###Negative Tests###
def test_should_throw_exception_when_attempting_to_create_invalid_user():
    with pytest.raises(UserServiceException) as exception_info:
        test_user = test_user_service.create_user();

    assert "UserDataEmpty" in str(exception_info.value);


def test_should_throw_exception_when_email_address_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_user = test_user_service.create_user(
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidEmail.Missing" in str(exception_info.value);


def test_should_throw_exception_when_first_name_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address=random_email_address(),
            handle="@bbanner-{}".format(test_date),
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidFirstName" in str(exception_info.value);


def test_should_throw_exception_when_last_name_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address=random_email_address(),
            handle="@bbanner-{}".format(test_date),
            first_name="Bruce",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidLastName" in str(exception_info.value);


def test_should_throw_exception_when_handle_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address=random_email_address(),
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidHandle" in str(exception_info.value);


def test_should_throw_exception_when_handle_is_invalid():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address=random_email_address(),
            handle="testhandle987@mail.com",
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidHandle.Format" in str(exception_info.value);


def test_should_throw_exception_when_creating_user_with_handle_that_already_exists():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_handle = random_user_handle();
        test_user = test_user_service.create_user(
            email_address=random_email_address(),
            handle=test_handle,
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

        test_user.save();

        test_user_service.create_user(
            email_address=random_email_address(),
            handle=test_handle,
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidHandle.HandleExists" in str(exception_info.value);


def test_should_throw_exception_when_phone_number_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address=random_email_address(),
            first_name="Bruce",
            last_name="Banner"
        );

    assert "MissingOrInvalidPhone" in str(exception_info.value);


def test_should_throw_exception_when_creating_user_with_email_that_already_exists():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_email_address = random_email_address();
        test_user = test_user_service.create_user(
            handle=random_user_handle(),
            motto="Hulk smash!",
            email_address=test_email_address,
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );
        test_user.save();

        test_user = test_user_service.create_user(
            handle=random_user_handle(),
            motto="Hulk smash!",
            email_address=test_email_address,
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidEmail.EmailExists" in str(exception_info.value);


def test_should_throw_exception_when_creating_user_with_invalid_email_address():
    with pytest.raises(UserServiceException) as exception_info:
        print(random_user_handle());
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            handle=random_user_handle(),
            motto="Hulk smash!",
            email_address="bogus_email",
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidEmail.Format" in str(exception_info.value);
