import React, { useState } from 'react';
import EmojiPicker from 'emoji-picker-react';

const EmojiPickerComponent = () => {
  const [emoji, setEmoji] = useState("");
  const [showPicker, setShowPicker] = useState(false);

  // Handle the emoji select
  const handleEmojiClick = (emojiData) => {
    setEmoji(emojiData.emoji);
    setShowPicker(false); // Hide the picker after selecting an emoji
  };

  return (
    <div>
      <button onClick={() => setShowPicker(!showPicker)}>
        {showPicker ? 'Close Emoji Picker' : 'Open Emoji Picker'}
      </button>

      {showPicker && (
        <EmojiPicker
          onEmojiClick={handleEmojiClick}
          groupVisibility={{
            animals: false, // Example to hide the animals group
          }}
        />
      )}

      <div>
        <h3>Selected Emoji: {emoji}</h3>
      </div>
    </div>
  );
};

export default EmojiPickerComponent;