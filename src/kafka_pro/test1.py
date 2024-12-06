import requests
from bs4 import BeautifulSoup
import pandas as pd
import time

# Define the base URL and initialize a list to hold job links
home_page = "https://www.keejob.com"
joblinks = []

# Step 1: Collect job links from multiple pages
# for i in range(1,2):
#     try:
response = requests.get(f'https://www.keejob.com/offres-emploi/metiers/recrutement-informatique-multimedia/?page={1}', timeout=10)
# print length   request pages
print(f"Page {1} loaded")
response.raise_for_status()
sp = BeautifulSoup(response.content, 'lxml')
print(sp)

        #  check kafka producer to reconfig  up a kafka  container 
        # we have a 34 of 135 description !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!


        # Find all job titles and extract links
        # joblist = sp.find_all("h6")
        # print(joblist)
        # for item in joblist:
            # for link in item.find_all('a', href=True):
                # joblinks.append(home_page + link['href'])
                # print(joblinks)
    # except requests.exceptions.RequestException as e:
        # print(f"Error fetching page {i}: {e}")
        # time.sleep(5)  # Retry delay if needed
        # continue
# print(joblinks)
# unit_job = joblinks[:3]
# # Step 2: Define a function to extract job details from a job link
# def get_job_details(link):
#     try:
#         response = requests.get(link, timeout=10)
#         response.raise_for_status()
#         sp = BeautifulSoup(response.content, 'lxml')
#         # print(sp)

#         # Helper function to find text after a given label
#         def get_text_after_label(label):
#             element = sp.find(string=label)
#             # print(element)
#             if element:
#                 sibling = element.find_next("br")
#                 if sibling and sibling.next_sibling:
#                     return sibling.next_sibling.strip()
                    
#             return "N/A"

#         # Extract job details
#         job_details = {
#             "Publiée le": get_text_after_label("Publiée le:"),
#             "Lieu de travail": get_text_after_label("Lieu de travail:"),
#             "Expérience": get_text_after_label("Expérience:"),
#             "Étude": get_text_after_label("Étude:"),
#             "Disponibilité": get_text_after_label("Disponibilité:"),
#             "Langues": get_text_after_label("Langues:"),
#             "Description de l'annonce": " ".join([span.text.strip() for span in sp.select("div.block_a.span12.no-margin-left p span")]),
#         }
#         # print(job_details, "#####################################################################1")
#         return job_details
#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching job details from {link}: {e}")
#         return None


# # Step 3: Loop through job links, get job details, and store them in a list
# job_data = []
# for link in unit_job:
#     details = get_job_details(link)
#     if details:
#         job_data.append(details)
#         description = details.get("Description de l'annonce", "")
#         desc_length = len(description)
#         # print(description)
#         print(f"Description length: {desc_length}")


# print(len(job_data),"#####################################################################2")
# Step 4: Convert list of job details dictionaries into a DataFrame
# df = pd.DataFrame(job_data)

# Print the DataFrame
# print("\nDataFrame with Job Details:")
# print(df)

# Optionally, save to a CSV file
# df.to_csv("job_details.csv", index=False)
# {'Publiée le': '2 novembre 2024', 
#  'Lieu de travail': 'Tunis,\n        \t\t\n        \t\t\n            \t\tTunisie',
#    'Expérience': 'Entre 2 et 5 ans'
#    , 'Étude': 'Bac + 3',
#      'Disponibilité': 'Plein temps',
#        'Langues': 'Arabe\n\t\t\t\t\t\t,\n\t\t\t\t\t\n\t\t\t\t\t\tFrançais\n\t\t\t\t\t\t,\n\t\t\t\t\t\n\t\t\t\t\t\tAnglais',
#          "Description de l'annonce": '  Les principales tâches: ·  ·  ·   ·  , ·  ·  ·  ; ·  ·   ·  ·\xa0\r\nPeut-être tenu d’assurer le transfert de compétences et la formation des\r\ngroupes de travail sur les solutions et les nouvelles technologies identifiées, ·  · ·  ; ·   ·  ·   ·  · '}