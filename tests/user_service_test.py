####UserService Unit Tests####
import pytest;
import random;
from datetime import datetime;
from services.exceptions import UserServiceException;
from app_config.app import app_config;
from services.user import UserService, UserValidator, User;
from lib.repository.user.my_sql import UserMySQLRepository;

test_user_validator = UserValidator(app_config["users"]);
test_user_mysql_repo = UserMySQLRepository(app_config["users"]["fields"]);
test_user_service = UserService(test_user_mysql_repo, test_user_validator);


def random_phone_number():
    p=list('0000000000')
    p[0] = str(random.randint(1,9))
    for i in [1,2,6,7,8]:
        p[i] = str(random.randint(0,9))
    for i in [3,4]:
        p[i] = str(random.randint(0,8))
    if p[3]==p[4]==0:
        p[5]=str(random.randint(1,8))
    else:
        p[5]=str(random.randint(0,8))
    n = range(10)
    if p[6]==p[7]==p[8]:
        n = (i for i in n if i!=p[6])
    p[9] = str(random.choice(n))
    p = ''.join(p)
    return p[:3] + '-' + p[3:6] + '-' + p[6:]


####Tests####


def test_should_return_new_user_instance():
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address="bbanner-{}@avengers.io".format(test_date),
        first_name="Bruce",
        last_name="Banner",
        phone_number=random_phone_number()
    );
    test_user.save();

    assert isinstance(test_user, User) == True;


def test_should_return_list_of_user_instances():
    test_date = datetime.now();
    test_user = test_user_service.create_user(
        handle="@hulk-{}".format(test_date),
        motto="Hulk smash!",
        email_address="bbanner-{}@avengers.io".format(test_date),
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
        email_address="bbanner-{}@avengers.io".format(test_date),
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
        email_address="bbanner-{}@avengers.io".format(test_date),
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
        email_address="bbanner-{}@avengers.io".format(test_date),
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
        email_address="bbanner-{}@avengers.io".format(test_date),
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
        email_address="bbanner-{}@avengers.io".format(test_date),
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

    assert "MissingOrInvalidEmail" in str(exception_info.value);


def test_should_throw_exception_when_first_name_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address="bbanner-{}@avengers.io".format(test_date),
            handle="@bbanner-{}".format(test_date),
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidFirstName" in str(exception_info.value);


def test_should_throw_exception_when_last_name_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address="bbanner-{}@avengers.io".format(test_date),
            handle="@bbanner-{}".format(test_date),
            first_name="Bruce",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidLastName" in str(exception_info.value);


def test_should_throw_exception_when_handle_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address="bbanner-{}@avengers.io".format(test_date),
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "MissingOrInvalidHandle" in str(exception_info.value);


def test_should_throw_exception_when_phone_number_is_missing():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_user = test_user_service.create_user(
            email_address="bbanner-{}@avengers.io".format(test_date),
            first_name="Bruce",
            last_name="Banner"
        );

    assert "MissingOrInvalidPhone" in str(exception_info.value);


def test_should_throw_exception_when_creating_user_with_email_that_already_exists():
    with pytest.raises(UserServiceException) as exception_info:
        test_date = datetime.now();
        test_email_address = "bbanner-{}@avengers.io".format(test_date);
        test_user = test_user_service.create_user(
            handle="@hulk-{}".format(test_date),
            motto="Hulk smash!",
            email_address=test_email_address,
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );
        test_user.save();

        test_user = test_user_service.create_user(
            handle="@hulk-{}".format(test_date),
            motto="Hulk smash!",
            email_address=test_email_address,
            first_name="Bruce",
            last_name="Banner",
            phone_number=random_phone_number()
        );

    assert "UserEmailAlreadyExists" in str(exception_info.value);