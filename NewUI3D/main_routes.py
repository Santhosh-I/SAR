from flask import Blueprint, render_template, request, jsonify
import json

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    return render_template('index.html')

@main_bp.route('/about')
def about():
    return render_template('about.html')

@main_bp.route('/projects')  
def projects():
    return render_template('projects.html')

@main_bp.route('/sar-visualization')
def sar_visualization():
    return render_template('sar-visualization.html')

@main_bp.route('/contact')
def contact():
    return render_template('contact.html')
