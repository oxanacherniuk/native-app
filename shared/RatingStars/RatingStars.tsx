import { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import StarIcon from '../../assets/icons/star';

export default function RatingStars({
    rating,
    onRatingChange,
    size = 32,
    maxStars = 5
}: {
    rating: number;
    onRatingChange?: (rating: number) => void;
    size?: number;
    maxStars?: number;
}) {
    const [currentRating, setCurrentRating] = useState(rating);

    const handlePress = (selectedRating: number) => {
        setCurrentRating(selectedRating);
        if (onRatingChange) {
        onRatingChange(selectedRating);
        }
    };

    return (
        <View style={{ flexDirection: 'row' }}>
        {Array.from({ length: maxStars }).map((_, index) => {
            const starValue = index + 1;
            return (
            <TouchableOpacity
                key={index}
                onPress={() => handlePress(starValue)}
                disabled={!onRatingChange}
            >
                <StarIcon
                    filled={starValue <= currentRating}
                    size={size}
                    color={starValue <= currentRating ? '#FFD700' : '#C0C0C0'}
                />
            </TouchableOpacity>
            );
        })}
        </View>
    );
}