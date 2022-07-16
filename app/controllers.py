import requests
from urllib3.util import Retry
from requests.adapters import HTTPAdapter
from concurrent.futures import ThreadPoolExecutor
from config import markers_list, headers, executor_workers


def http_get(url):
    session = requests.Session()
    retry = Retry(connect=3, backoff_factor=0.5)
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('http://', adapter)

    return session.get(url, headers=headers)


def request_executor(urls):
    with ThreadPoolExecutor(max_workers=executor_workers) as pool:
        return list(pool.map(http_get, urls))


def scrape(country_code):
    print(country_code)
    urls = []

    r = requests.get('http://insecam.org/en/bycountry/{}/?page=1'.format(country_code), headers=headers)  # Get number of pages

    try:
        pages = int(r.text.split('pagenavigator("?page=", ')[1].split(",")[0])
    except:
        pages = 0  # No detected Cameras in a country

    if pages == 1:
        pages = pages + 1

    _urls = []
    for i in range(1, pages):
        _urls.append('http://insecam.org/en/bycountry/{}/?page={}'.format(country_code, str(i)))

    response_list = request_executor(_urls)

    for r in response_list:
        for x in range(0, r.text.count('/en/view/')):  # find the URL for all Cameras on that pages (usual 6)
            urls.append(r.text.split('/en/view/')[x + 1].split('/"')[0])

    _urls = []
    response_list = []

    for id in urls:
        _urls.append('http://insecam.org/en/view/{}'.format(id))

    response_list = request_executor(_urls)

    for r in response_list:
        try:
            country = r.text.split('Country:')[1].split('title="')[1].split('">')[1].split('</a>')[0].strip()
        except Exception:
            country = ""

        try:
            region = r.text.split('Region:')[1].split('title="')[1].split('">')[1].split('</a>')[0].strip()
        except Exception:
            region = ""

        try:
            city = r.text.split('City:')[1].split('title="')[1].split('">')[1].split('</a>')[0].strip()
        except Exception:
            city = ""

        try:
            zip_code = r.text.split("ZIP:")[1].split('">\n')[1].split("\n")[0].strip()
        except Exception:
            zip_code = ""

        try:
            timezone = r.text.split('Timezone:')[1].split('title="')[1].split('">')[1].split('</a>')[0].strip()
        except Exception:
            timezone = ""

        try:
            manufacturer = r.text.split('Manufacturer:')[1].split('title="')[1].split('">')[1].split('</a>')[0].strip()
        except Exception:
            manufacturer = ""

        try:
            lat = float(r.text.split("Latitude:")[1].split('">\n')[1].split("\n")[0].strip())
        except Exception:
            continue

        try:
            lng = float(r.text.split("Longitude:")[1].split('">\n')[1].split("\n")[0].strip())
        except Exception:
            continue

        try:
            stream = r.text.split('image0')[1].split('src="')[1].split('"')[0]
        except Exception:
            stream = ""

        markers_list.append({
            "id": id,
            "country": country,
            "country_code": country_code,
            "region": region,
            "city": city,
            "zip": zip_code,
            "timezone": timezone,
            "manufacturer": manufacturer,
            "lat": lat,
            "lng": lng,
            "stream": stream
        })
