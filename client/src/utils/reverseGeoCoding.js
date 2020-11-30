import axios from "axios";

export const reversedGeoCoding = async (long, lat) => {
    const { data } = await axios.get(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${long},${lat}.json?access_token=${process.env.REACT_APP_MAPBOX_TOKEN}`
    );

    const place = data.features.find((el) => el.id.includes("place"));
    const address = data.features.find((el) => el.id.includes("address"));
    const country = data.features.find((el) => el.id.includes("country"));

    if (!place || !place.text || !country || !country.text) {
        return {
            error: "Hm, we can't find this place",
        };
    }

    return { spot: `${place.text.trim()}-${country.text.trim()}`, address: address.place_name || "" };

};
