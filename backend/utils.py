def convert_priority_param_to_list(priority_param):
    return priority_param[0].split(',')


def convert_status(status: str):
    if status == "Done":
        return True
    elif status == "Not Yet":
        return False
    return None
