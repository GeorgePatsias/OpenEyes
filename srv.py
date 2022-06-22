import json
from os import path, system
from threading import Thread
from flask_compress import Compress
from controllers import scrape, markers_list
from flask import Flask, render_template, redirect, url_for, send_from_directory, jsonify
from config import country_list, FLASK_HOST, FLASK_PORT, FLASK_DEBUG, FLASK_THREADED, FLASK_SECRET, markers_list

app = Flask(__name__)
Compress(app)

app.secret_key = FLASK_SECRET


@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return send_from_directory(path.join(app.root_path, 'static/img'), 'favicon.ico', mimetype='image/vnd.microsoft.icon')


@app.route('/', methods=['GET'])
def map_page():
    return render_template('index.html')


@app.route('/get_cams', methods=['GET'])
def get_scrape_cams_json():
    try:
        data_file = open('markers.json')
        data = json.load(data_file)
        data_file.close()

        return jsonify(data), 200

    except Exception:
        return {}, 200


@app.route('/scrape_cams', methods=['GET'])
def scrape_cams_json():
    try:
        system('rm markers_loading.json')
    except Exception:
        pass

    system('touch markers_loading.json')

    threads = []
    for y in range(0, len(country_list)):
        threads.append(Thread(target=scrape, args=(country_list[y], )))

    for x in threads:
        x.start()

    for x in threads:
        x.join()

    with open('./markers_loading.json', 'w', encoding='utf8') as markers_file:
        json.dump(markers_list, markers_file)

    system('mv markers_loading.json markers.json')

    return redirect(url_for('map_page'))


if __name__ == '__main__':
    app.run(
        host=FLASK_HOST,
        port=FLASK_PORT,
        debug=FLASK_DEBUG,
        threaded=FLASK_THREADED
    )
