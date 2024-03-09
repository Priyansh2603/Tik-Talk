import React, { useState } from 'react';
import EmojiPicker from 'react-emoji-picker';

const EmojiPickerComponent = ({ onSelectEmoji }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiSelect = emoji => {
    onSelectEmoji(emoji.native);
    setShowEmojiPicker(false);
  };

  return (
    <div>
      <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>😀</button>
      {showEmojiPicker && (
        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          pickerStyle={{ position: 'absolute', bottom: '50px', right: '10px' }} // Adjust position as needed
        />
      )}
    </div>
  );
};

export default EmojiPickerComponent;
