from flask import Flask, render_template, redirect, url_for, request, flash, jsonify

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

@app.route('/')
def home():
    return render_template('home.html', active_page='home')

@app.route('/japan-story')
def japan_story():
    return render_template('japan_story.html', active_page='japan-story')

@app.route('/about')
def about():
    return render_template('about.html', active_page='about')

@app.route('/services')
def services():
    return render_template('services.html', active_page='services')

@app.route('/contact', methods=['GET', 'POST'])
def contact():
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        message = request.form.get('message')
        
        flash(f'Thank you {name}! Your message has been received.', 'success')
        return redirect(url_for('contact'))
    
    return render_template('contact.html', active_page='contact')

@app.route('/api/sar-data')
def sar_data():
    # Sample SAR data for Japan earthquake
    return jsonify({
        'location': 'Tohoku, Japan',
        'date': '2011-03-11',
        'magnitude': 9.0,
        'damage_detected': True,
        'analysis': 'Significant coastal deformation and tsunami impact zones identified'
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
