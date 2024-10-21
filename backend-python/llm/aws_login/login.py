import subprocess
import re
import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from subprocess import check_output

def get_aws_sso_details():
    process = subprocess.Popen(['aws', 'sso', 'login', '--no-browser'], stdout=subprocess.PIPE, stderr=subprocess.PIPE, text=True)
    output = ""
    # print(process.stdout)
    # out = check_output(['aws', 'sso', 'login', '--no-browser'])
    print(out)
    for line in process.stdout:
        print(line)
        output += line

        url_match = re.search(r'https://[^\s]+', output)
        code_match = re.search(r'[A-Z0-9]{4}-[A-Z0-9]{4}', output)

        if url_match and code_match:
            return url_match.group(0), code_match.group(0)

    process.stdout.close()
    process.wait()

    raise ValueError("SSO login URL or code not found in the output")

def automate_sso_login(url, code, username, password):
    options = Options()
    # options.add_argument('--headless=new')
    driver = webdriver.Chrome(options=options)
    driver.get(url + "?user_code=" + code)

    wait = WebDriverWait(driver, 10)
    confirm_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Confirm and continue']")))
    confirm_button.click()

    email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="text"]')))
    email_input.send_keys(username)
    email_next_button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'button[type="submit"]')))
    email_next_button.click()

    password_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="password"]')))
    password_input.send_keys(password)
    sign_in_button = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'button[type="submit"]')))
    sign_in_button.click()

    allow_access_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='allow-access-button']")))
    allow_access_button.click()

    time.sleep(5)
    driver.quit()

def login_to_aws_sso(username, password):
    try:
        url, code = get_aws_sso_details()
        automate_sso_login(url, code, username, password)
        return True
    except Exception:
        return False
