const fs = require('fs');
const csvParser = require('csv-parser');
const path = require('path');

exports.getPrice = async (req, res) => {
    const { crop, state, monthYear } = req.body;

    if (!crop || !state || !monthYear) {
        return res.status(400).json({ error: 'Crop, state, and monthYear are required.' });
    }

    const cleanCrop = crop.split(' ').join('');
    const cleanState = state.split(' ').join('');
    const cleanMonthYear = monthYear.trim();
    console.log(cleanCrop);
    console.log(`Searching for crop: ${cleanCrop}, state: ${cleanState}, monthYear: ${cleanMonthYear}`);

    try {
        let foundPrice;
        const datapath = path.join(__dirname, '../data', `Gur.csv`);
        const csvStream = fs.createReadStream(datapath).pipe(csvParser());

        csvStream.on('data', (row) => {
            if (row['state'] === cleanState && row['crop'] === cleanCrop) {
                foundPrice = row[cleanMonthYear];
                console.log(`Found price: ${foundPrice} for ${cleanState} in ${cleanMonthYear} ${cleanCrop}`);
            }
        });

        csvStream.on('end', () => {
            if (foundPrice !== undefined) {
                res.json({
                    crop: crop,
                    state: cleanState,
                    monthYear: cleanMonthYear,
                    price: foundPrice
                });
            } else {
                res.status(404).json({ error: `No data found for ${cleanState} in ${cleanMonthYear}` });
            }
        });

        csvStream.on('error', (err) => {
            console.error(err);
            res.status(500).json({ error: 'Error reading data file' });
        });

    } catch (err) {
        console.error('Error opening CSV file:', err);
        res.status(500).json({ error: 'Error accessing data file' });
    }
};
