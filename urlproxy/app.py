# -*- coding: utf-8 -*-
__author__ = 'pettai'

from flask import Flask, render_template, request, send_from_directory
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import os
import urllib
import base64
import dns.resolver
import geoip2.database


app = Flask(__name__)
limiter = Limiter(app, key_func=get_remote_address)

@app.route('/', methods=['GET'])
@limiter.limit("1/second")
def urlproxy():
    return render_template('index.html', title='No Data')

@app.route('/canit/urlproxy.php', methods=['GET'])
@limiter.limit("1/second")
def caniturlproxy():
    base64url = request.args.get('_q')
    decoded = base64.b64decode(base64url)
    url = decoded.decode("utf-8")
    fqdn = urllib.parse.urlparse(url).netloc
    country = 'Unknown'
    city = 'Unknown'
    asn = '???'
    asnname = 'Unknown'
    try:
        answers = dns.resolver.resolve(fqdn, 'A')
        for iter in answers:
            ipv4 = iter.to_text()
            with geoip2.database.Reader('/opt/flask-urlproxy/data/GeoLite2-City.mmdb') as reader:
                response = reader.city(ipv4)
                country = response.country.name
                city = response.city.name
            with geoip2.database.Reader('/opt/flask-urlproxy/data/GeoLite2-ASN.mmdb') as reader:
                response = reader.asn(ipv4) 
                asn = response.autonomous_system_number
                asnname = response.autonomous_system_organization
    except dns.resolver.NXDOMAIN:
        ipv4 = 'NXDOMAIN'
    except dns.exception.DNSException:
        ipv4 = 'SERVFAIL'
    return render_template('urlproxy.html', title='CanIt-Domain-PRO', url=(url), fqdn=(fqdn), ipv4=(ipv4), country=(country), city=(city), asn=(asn), asnname=(asnname))

@app.route("/canit/static/<path:path>")
def static_dir(path):
    return send_from_directory("canit/static", path)
