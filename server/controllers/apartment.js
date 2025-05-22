import Apartment from "../models/apartment.js"
import { addToCategoryApertment } from "./category.js"
import { addToCityApertment } from "./city.js"

// פונקציית הוספת דירה
export const addApartment = async (req, res) => {
    const {
        name,
        description,
        cityId,
        categoryId,
        address,
        price,
        numBed,
        advertiserId,
        image // התמונה בבסיס64
    } = req.body;

    if (!name || !description || !cityId || !categoryId || !address || !price || !numBed || !image) {
        return res.status(400).json(req.body);
    }

    const apartment = new Apartment({
        name,
        description,
        cityId,
        categoryId,
        address,
        price,
        numBed,
        advertiserId,
        image // שמירת התמונה בבסיס64
    });

    try {
        const savedApartment = await apartment.save();
        const reqCity = {
            id: savedApartment._id,
            cityId
        };
        const reqCategory = {
            id: savedApartment._id,
            categoryId
        };

        await addToCategoryApertment(reqCategory, res);
        await addToCityApertment(reqCity, res);

        return res.status(201).json(savedApartment);
    } catch (err) {
        return res.status(500).send({ err: err.message });
    }
};

//מחיקה
export const remove = async (req, res) => {
    const { id } = req.params;
    const loggedInUserId = req.userId; // ה-ID של המשתמש המחובר מגיע מה-middleware checkToken

    console.log(`Attempting to delete apartment with ID: ${id} by user: ${loggedInUserId}`);

    try {
        const apartment = await Apartment.findById(id);
        if (!apartment) {
            return res.status(404).send({ message: `דירה ${id} לא נמצאה!` });
        }

        // בדוק אם המשתמש המחובר הוא בעל הדירה
        if (apartment.advertiserId.toString() !== loggedInUserId) {
            console.log(`User ${loggedInUserId} is not the owner of apartment ${id}.`);
            return res.status(403).send({ message: 'אין לך הרשאה למחוק דירה זו!' });
        }

        await Apartment.findByIdAndDelete(id);
        console.log(`Apartment with ID: ${id} deleted successfully by user: ${loggedInUserId}.`);
        return res.status(200).send({ message: `דירה ${id} נמחקה בהצלחה!` });
    } catch (err) {
        console.error(`Error deleting apartment with ID: ${id}`, err);
        return res.status(500).send({ error: err.message });
    }
};

//עידכון
export const editApartment = async (req, res) => {
    // const { _id, name, description, cityId, categoryId, address, price, numBed, additives } = req.body;
    const {  name, description, cityId, categoryId, address, price, numBed, additives } = req.body
    const { _id } = req.params;
    // if (!_id || !name || !description || !address || !price || !numBed) {
    if ( !name || !description || !address || !price || !numBed) {
      return res.status(400).json({ message: "חסר מידע" });
    }
  
    try {
      const updated = await Apartment.findByIdAndUpdate(_id, {
        name,
        description,
        cityId,
        categoryId,
        address,
        price,
        numBed,
        additives,
        advertiserId:req.body.advertiserId
      }, { new: true });
  
      if (!updated) return res.status(404).json({ message: "לא נמצאה דירה" });
  
      return res.json(updated);
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "שגיאה בשרת" });
    }
  };

//שליפות  
// פונקציה מעודכנת לשליפת דירות לפי פילטרים
export const getAll = async (req, res) => {
    try {
        console.log('Request query params:', req.query); // בדיקת פרמטרים שמגיעים
        
        const { cityId, categoryId, numBed, minPrice, maxPrice } = req.query;
        const query = {};
  
        if (cityId && cityId !== '') query.cityId = cityId;
        if (categoryId && categoryId !== '') query.categoryId = categoryId;
        
        if (numBed && numBed !== '') {
            query.numBed = { $gte: parseInt(numBed) };
        }
        
        // טיפול במחיר רק אם גם מינימום וגם מקסימום הוגדרו
        if (minPrice !== undefined && maxPrice !== undefined) {
            const min = parseFloat(minPrice);
            const max = parseFloat(maxPrice);
            
            if (!isNaN(min) && !isNaN(max)) {
                query.price = { $gte: min, $lte: max };
                console.log(`Setting price filter: ${min} to ${max}`);
            }
        }
        
        console.log('Final MongoDB query:', JSON.stringify(query));
        
        const apartments = await Apartment.find(query);
        console.log(`Found ${apartments.length} apartments`);
        
        res.status(200).json(apartments);
    } catch (error) {
        console.error('Error in getAll:', error);
        res.status(500).json({ message: error.message });
    }
};

// id שליפה לפי  
export const getById = (req, res) => {
    Apartment.findById(req.params.id)
        .then(apartments => {
            if (!apartments) {
                return res.status(404).send({ error: 'apartment not found' });
            }
            res.status(200).send({ id: apartments._id });
        })
        .catch(err => {
            res.status(500).send({ error: err.message });
        });
}

//שלפה לפי קוד קטגוריה
export const getByCategoryId = (req, res) => {
    Apartment.find({ categoryId: req.params.categoryId })
        .then(apartments => {
            if (apartments.length === 0) {
                return res.status(404).send({ error: 'No apartments found for this category' })
            }
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

//שלפה לפי קוד עיר
export const getByCityId = (req, res) => {
    Apartment.find({ cityId: req.params.cityId })
        .then(apartments => {
            if (apartments.length === 0) {
                return res.status(404).send({ error: 'No apartments found for this city' })
            }
            res.status(200).send(apartments)
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

//שליפה לפי מספר מיטות
export const getByNumBeds = (req, res) => {
    const { numBed } = req.query; // קבלת numBed מ-req.query
    if (numBed === undefined || numBed === '') {
      // אם לא סופק numBed, החזר את כל הדירות או טפל במקרה בהתאם לצורך שלך
      return res.status(400).send({ error: 'Please provide the number of beds to filter by.' });
    }
  
    Apartment.find({ numBed: { $gte: parseInt(numBed) } }) // שימוש ב-$gte
      .then(apartments => {
        if (apartments.length === 0) {
          return res.status(404).send({ error: `No apartments found with ${numBed} or more beds.` });
        }
        res.status(200).send(apartments);
      })
      .catch(err => {
        res.status(500).send({ error: err.message });
      });
  };

//שליפה לפי מחיר
export const getByPrice = (req, res) => {
    Apartment.find({ price: req.params.price })
        .then(apartments => {
            if (apartments.length === 0) {
                return res.status(404).send({ error: 'No apartments found with this price' })
            }
            res.status(200).send(apartments);
        })
        .catch(err => {
            res.status(500).send({ error: err.message })
        })
}

//שלפה לפי קוד מפרסם
export const getByAdvertiserId = (req, res) => {
    const { advertiserId } = req.params;
    console.log('[Server - getByAdvertiserId] Searching for advertiserId:', advertiserId); // לוג של ה-ID שהתקבל
    Apartment.find({ advertiserId: advertiserId })
        .then(apartments => {
            console.log('[Server - getByAdvertiserId] Found apartments:', apartments); // לוג של הדירות שנמצאו
            if (!apartments || apartments.length === 0) {
                console.log('[Server - getByAdvertiserId] No apartments found for this advertiser.'); // לוג אם לא נמצאו דירות
                return res.status(404).send({ error: 'No apartments found for this advertiser' });
            }
            res.status(200).send(apartments);
        })
        .catch(err => {
            console.error('[Server - getByAdvertiserId] Error:', err); // לוג של שגיאה
            res.status(500).send({ error: err.message });
        });
};
