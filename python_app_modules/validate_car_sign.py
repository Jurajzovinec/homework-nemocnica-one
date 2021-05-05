class Car_sign_validation_error(Exception):
    def __init__(self, message):
        super().__init__(message)


def validate_car_sign(read_text_from_image, filename):

    # rules of car sign from https://www.zones.sk/studentske-prace/nezaradene/17575-ceske-spz-ecv-vysvetlenie/

    banned_letters = ['G', 'O', 'Q', 'W']

    if read_text_from_image == '':
        raise Car_sign_validation_error(
            f'Any text spotted in image'
        )

    if any(not c.isalnum() for c in read_text_from_image):
        raise Car_sign_validation_error(
            f'Non alphanumeric character in car sign. Car sign is {read_text_from_image}. Filename on aws S3 is {filename}.')

    if any(banned_letter in read_text_from_image for banned_letter in banned_letters):
        raise Car_sign_validation_error(
            f'There is banned letter in car sign. Car sign is {read_text_from_image}. Filename on aws S3 is {filename}.')

    if len(read_text_from_image) < 5 or len(read_text_from_image) > 8:
        raise Car_sign_validation_error(
            f'Invalid amount of characters in car sign. Amount of characters in car sign should be in range of [5, 8]. This car sign has {len(read_text_from_image)} characters. Car sign is {read_text_from_image}. Filename on aws S3 is {filename}.')

    if all(c.isalpha() for c in read_text_from_image):
        raise Car_sign_validation_error(
            f'Car sign should contain at least one number. Car sign is {read_text_from_image}. Filename on aws S3 is {filename}.')

    if all(c.isnumeric() for c in read_text_from_image):
        raise Car_sign_validation_error(
            f'Car sign should contain at least one letter. Car sign is {read_text_from_image}. Filename on aws S3 is {filename}.')
