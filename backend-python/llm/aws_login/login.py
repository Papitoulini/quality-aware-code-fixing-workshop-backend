import subprocess
import re
import time
import os
import shutil
import sys
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def clear_aws_sso_cache():
    # Log out of AWS SSO
    try:
        subprocess.run(['aws', 'sso', 'logout'], check=True)
        print("Logged out of AWS SSO.")
    except subprocess.CalledProcessError as e:
        print(f"Error logging out of AWS SSO: {e}")

    # Delete AWS SSO cache directory
    aws_sso_cache_dir = os.path.expanduser(r'~\\.aws\\sso\\cache')
    if os.path.exists(aws_sso_cache_dir):
        try:
            shutil.rmtree(aws_sso_cache_dir)
            print("AWS SSO cache cleared.")
        except Exception as e:
            print(f"Error deleting AWS SSO cache: {e}")
    else:
        print("AWS SSO cache directory does not exist.")

def get_aws_sso_details():
    print("Starting get_aws_sso_details")
    process = subprocess.Popen(
        ['aws', 'sso', 'login', '--no-browser'],
        stdout=subprocess.PIPE,
        stderr=subprocess.STDOUT,
        text=True
    )

    url = None
    code = None

    # Read the output line by line
    while True:
        line = process.stdout.readline()
        if not line:
            break
        print(line.strip())

        if not url:
            url_match = re.search(r'(https://device\.sso\.[^\s]+)', line)
            if url_match:
                url = url_match.group(1)
        if not code:
            code_match = re.search(r'([A-Z0-9]{4}-[A-Z0-9]{4})', line)
            if code_match:
                code = code_match.group(1)
        if url and code:
            print(f"URL and code found: {url}, {code}")
            break

    if not url or not code:
        process.kill()
        raise ValueError("SSO login URL or code not found in the output")

    return process, url, code

def automate_sso_login(url, code, username, password):
    options = Options()
    # Uncomment the next line to run in headless mode
    # options.add_argument('--headless')
    driver = webdriver.Chrome(options=options)
    driver.get(f"{url}?user_code={code}")

    wait = WebDriverWait(driver, 30)

    try:
        # Accept the confirmation (if applicable)
        confirm_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[text()='Confirm and continue']")))
        confirm_button.click()
        print("Clicked 'Confirm and continue'.")

        # Enter the email/username
        email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="email"], input[type="text"]')))
        email_input.send_keys(username)
        print("Entered username.")

        email_next_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"], input[type="submit"]')))
        email_next_button.click()
        print("Clicked next after entering username.")

        # Enter the password
        password_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, 'input[type="password"]')))
        password_input.send_keys(password)
        print("Entered password.")

        sign_in_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, 'button[type="submit"], input[type="submit"]')))
        sign_in_button.click()
        print("Clicked sign in.")

        # Allow access (if prompted)
        try:
            allow_access_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[@data-testid='allow-access-button'] | //button[text()='Allow']")))
            allow_access_button.click()
            print("Clicked 'Allow access'.")
        except Exception as e:
            print("No 'Allow access' button found, proceeding.")

        # Wait for the login process to complete
        time.sleep(5)
        print("Login process completed.")
    except Exception as e:
        print(f"An error occurred during the Selenium automation: {e}")
        import traceback
        traceback.print_exc()
    finally:
        driver.quit()

def login_to_aws_sso(username, password):
    try:
        # Clear AWS SSO cache and log out
        clear_aws_sso_cache()

        # Get new SSO details
        process, url, code = get_aws_sso_details()

        # Automate the login
        automate_sso_login(url, code, username, password)
        print("AWS SSO login completed successfully.")

        # Wait for the aws sso login command to complete
        print("Waiting for AWS SSO login process to complete...")
        process.wait()
        print("AWS SSO login process completed.")
        return True
    except Exception as e:
        print(f"Login failed: {e}")
        return False
