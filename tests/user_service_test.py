####UserService Unit Tests####
import random;
from datetime import datetime;
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
