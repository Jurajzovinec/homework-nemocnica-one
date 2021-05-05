import string
import random

def name_generator(size=6, chars=string.ascii_uppercase + string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def remove_non_alphanumeric_chars(text):
    return ''.join([character for character in text if character.isalnum()])
