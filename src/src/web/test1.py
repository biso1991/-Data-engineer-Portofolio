import requests
from bs4 import BeautifulSoup
import pandas as pd

# Define the base URL and initialize a list to hold job links
home_page = "https://www.keejob.com"
joblinks = []

# Step 1: Collect job links from multiple pages
for i in range(1, 5):
    response = requests.get(f'https://www.keejob.com/offres-emploi/metiers/recrutement-informatique-multimedia/?page={i}')
    sp = BeautifulSoup(response.content, 'lxml')

    # Find all job titles and extract links
    joblist = sp.find_all("h6")
    for item in joblist:
        for link in item.find_all('a', href=True):
            joblinks.append(home_page + link['href'])

# Print collected job links (optional)
# print("Job Links:", joblinks)

# Step 2: Define a function to extract job details from a job link
def get_job_details(link):
    response = requests.get(link)
    sp = BeautifulSoup(response.content, 'lxml')

    # Helper function to find text after a given label
    def get_text_after_label(label):
        element = sp.find(string=label)
        if element:
            sibling = element.find_next("br")
            if sibling and sibling.next_sibling:
                return sibling.next_sibling.strip()
        return "N/A"

    # Extract job details
    job_details = {
        "Publiée le": get_text_after_label("Publiée le:"),
        "Lieu de travail": get_text_after_label("Lieu de travail:"),
        "Expérience": get_text_after_label("Expérience:"),
        "Étude": get_text_after_label("Étude:"),
        "Disponibilité": get_text_after_label("Disponibilité:"),
        "Langues": get_text_after_label("Langues:"),
        "Description de l'annonce": " ".join([span.text.strip() for span in sp.select("div.block_a.span12.no-margin-left p span")]),
    }

    return job_details

# Step 3: Loop through job links, get job details, and store them in a list
job_data = []
for link in joblinks:
    job_data.append(get_job_details(link))

# Step 4: Convert list of job details dictionaries into a DataFrame
df = pd.DataFrame(job_data)

# Print the DataFrame
print("\nDataFrame with Job Details:")
print(df)

# Optionally, save to a CSV file
df.to_csv("job_details.csv", index=False)

# Optional: Print job details to verify
# for job in job_data:
#     print(job)
