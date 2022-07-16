<div align="center">
<h1>👁️ OpenEyes 👁️<h1>

![GitHub stars](https://img.shields.io/github/stars/GeorgePatsias/OpenEyes)
![GitHub forks](https://img.shields.io/github/forks/GeorgePatsias/OpenEyes)
![GitHub size](https://img.shields.io/github/languages/code-size/GeorgePatsias/OpenEyes)
![GitHub lastcommit](https://img.shields.io/github/last-commit/GeorgePatsias/OpenEyes)

<a href="https://twitter.com/intent/follow?screen_name=GeorgePatsias1">

![Github twitter](https://img.shields.io/twitter/follow/GeorgePatsias1?label=Follow%20%40%20Twitter&style=social)
</a>
</div>
<br>
Open IP Cameras, with default credentials - publicly accessible, scrapped from http://www.insecam.org/. Every camera is placed on a Google Map with live stream and information.

## 🏗️ Installation
```
git clone https://github.com/GeorgePatsias/OpenEyes.git
pip install -r requirements.txt
```

## ▶️ 🐍 Run
Edit the `config.py` with the desired configurations and run.
```
python3 srv.py
```

## ▶️ 🐋 Docker Run
Edit the `config.py` with the desired configurations and run.
```
docker build -t openeyes . && docker run -p 5001:5001 openeyes
```

<br>
<div align="center">
<img src=image.png>
</div>

[!["Buy Me A Coffee"](https://www.buymeacoffee.com/assets/img/custom_images/orange_img.png)](https://www.buymeacoffee.com/UserX)
