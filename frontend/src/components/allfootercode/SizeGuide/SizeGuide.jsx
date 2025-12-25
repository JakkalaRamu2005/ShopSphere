import React from 'react';
import './SizeGuide.css';

export default function SizeGuide() {
  return (
    <div className="size-page">
      <div className="size-hero">
        <h1>📏 Size Guide</h1>
        <p>Find your perfect fit</p>
      </div>

      <div className="size-container">
        
        {/* Men's Clothing */}
        <section className="size-section">
          <h2>Men's Clothing</h2>
          <div className="table-wrapper">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Chest (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Shoulder (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XS</td>
                  <td>34-36</td>
                  <td>28-30</td>
                  <td>16-17</td>
                </tr>
                <tr>
                  <td>S</td>
                  <td>36-38</td>
                  <td>30-32</td>
                  <td>17-18</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>38-40</td>
                  <td>32-34</td>
                  <td>18-19</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>40-42</td>
                  <td>34-36</td>
                  <td>19-20</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>42-44</td>
                  <td>36-38</td>
                  <td>20-21</td>
                </tr>
                <tr>
                  <td>XXL</td>
                  <td>44-46</td>
                  <td>38-40</td>
                  <td>21-22</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Women's Clothing */}
        <section className="size-section">
          <h2>Women's Clothing</h2>
          <div className="table-wrapper">
            <table className="size-table">
              <thead>
                <tr>
                  <th>Size</th>
                  <th>Bust (inches)</th>
                  <th>Waist (inches)</th>
                  <th>Hips (inches)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>XS</td>
                  <td>30-32</td>
                  <td>24-26</td>
                  <td>34-36</td>
                </tr>
                <tr>
                  <td>S</td>
                  <td>32-34</td>
                  <td>26-28</td>
                  <td>36-38</td>
                </tr>
                <tr>
                  <td>M</td>
                  <td>34-36</td>
                  <td>28-30</td>
                  <td>38-40</td>
                </tr>
                <tr>
                  <td>L</td>
                  <td>36-38</td>
                  <td>30-32</td>
                  <td>40-42</td>
                </tr>
                <tr>
                  <td>XL</td>
                  <td>38-40</td>
                  <td>32-34</td>
                  <td>42-44</td>
                </tr>
                <tr>
                  <td>XXL</td>
                  <td>40-42</td>
                  <td>34-36</td>
                  <td>44-46</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* How to Measure */}
        <section className="size-section">
          <h2>How to Measure</h2>
          <div className="measure-grid">
            
            <div className="measure-card">
              <div className="measure-icon">📐</div>
              <h3>Chest/Bust</h3>
              <p>Measure around the fullest part of your chest/bust, keeping the tape parallel to the floor.</p>
            </div>

            <div className="measure-card">
              <div className="measure-icon">📏</div>
              <h3>Waist</h3>
              <p>Measure around your natural waistline, keeping the tape comfortably loose.</p>
            </div>

            <div className="measure-card">
              <div className="measure-icon">📍</div>
              <h3>Hips</h3>
              <p>Measure around the fullest part of your hips, approximately 8 inches below your waist.</p>
            </div>

            <div className="measure-card">
              <div className="measure-icon">👔</div>
              <h3>Shoulder</h3>
              <p>Measure from the edge of one shoulder to the other across your back.</p>
            </div>

          </div>
        </section>

        {/* Tips */}
        <section className="size-section">
          <h2>Sizing Tips</h2>
          <div className="tips-box">
            <ul>
              <li>✅ Use a soft measuring tape for accurate measurements</li>
              <li>✅ Measure over light clothing or undergarments</li>
              <li>✅ If between sizes, choose the larger size for comfort</li>
              <li>✅ Check product-specific size charts as fits may vary</li>
              <li>✅ Still unsure? Contact our support team for help!</li>
            </ul>
          </div>
        </section>

      </div>
    </div>
  );
}
