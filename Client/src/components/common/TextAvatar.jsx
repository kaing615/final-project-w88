import { Avatar } from "@mui/material";

const TextAvatar = ({ text }) => {
  // Hàm sinh màu từ chuỗi
  const stringToColor = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = "#";
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    return color;
  };

  // Lấy ký tự đầu của từng từ (tối đa 2 ký tự, bỏ dấu cách thừa)
  const getInitials = (str) => {
    const words = str.trim().split(" ").filter(Boolean);
    if (words.length === 0) return "";
    if (words.length === 1) return words[0][0].toUpperCase();
    return `${words[0][0]}${words[1][0]}`.toUpperCase();
  };

  return (
    <Avatar
      sx={{
        backgroundColor: stringToColor(text),
        width: 40,
        height: 40,
        fontWeight: 700,
        fontSize: 20,
      }}
    >
      {getInitials(text)}
    </Avatar>
  );
};

export default TextAvatar;
