import React from "react";
import {
  Stack,
  Box,
  Typography,
  Menu,
  MenuItem,
  IconButton,
  Divider,
} from "@mui/material";
import { useTheme, alpha } from "@mui/material/styles";
import { motion } from "framer-motion";
import { BsThreeDotsVertical, BsDownload, BsImage } from "react-icons/bs";
// import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
// import { text_options } from "@/data";
// import { Link } from "react-router-dom";
// import truncateString from "../../utils/truncate";
// import { LinkPreview } from "@dhaiwat10/react-link-preview";
import Embed from "react-embed";
import { IoCheckmark, IoCheckmarkDoneOutline } from "react-icons/io5";

// const textOption = () => {
//   const [anchorEl, setAnchorEl] = React.useState(null);
//   const open = Boolean(anchorEl);
//   const handleClick = (event) => {
//     setAnchorEl(event.currentTarget);
//   };
//   const handleClose = () => {
//     setAnchorEl(null);
//   };
//   return (
//     <>
//       <DotsThreeVertical
//         size={20}
//         id="basic-button"
//         aria-controls={open ? "basic-menu" : undefined}
//         aria-haspopup="true"
//         aria-expanded={open ? "true" : undefined}
//         onClick={handleClick}
//       />
//       <Menu
//         id="basic-menu"
//         anchorEl={anchorEl}
//         open={open}
//         onClose={handleClose}
//         MenuListProps={{
//           "aria-labelledby": "basic-button",
//         }}
//       >
//         <Stack spacing={1} px={1}>
//           {text_options.map((el) => (
//             <MenuItem onClick={handleClose}>{el.title}</MenuItem>
//           ))}
//         </Stack>
//       </Menu>
//     </>
//   );
// };

const TextMsg = ({ el }) => {
  const theme = useTheme();
  // const {typingUsers } = useSelector((state) => state.app);
  // let isFriendTyping = typingUsers?.includes(user_id);
  const iconStyle = {
    fontSize: "1.5rem", // Adjust the size as needed
    color: el.status === "Seen" ? "#04e813" : "#f2f3f2", // Adjust the colors as needed
  };

  return (
    <Stack
      direction="row"
      justifyContent={el.incoming ? "start" : "end"}
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1, transition: { duration: 1 } }}
      // whileHover={{
      //   backgroundColor: "rgb(25 ,33, 41)",
      //   transition: { duration: 0.3 },
      // }}
    >

      <Box
        px={1.5}
        pt={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
          display: "flex",
          flexDirection: "row",
          columnGap: "12px",
          paddingBottom: el.outgoing ? "4px" : "8px",
          // rowGap:"14"
          // alignItems: el.incoming ? 'flex-start' : 'flex-end',
        }}
      >
        {/* <Box> */}
        <Typography
          variant="body2"
          color={el.incoming ? theme.palette.text : "#fff"}
        >
          {el.text}
        </Typography>
        {/* </Box> */}

        <Stack
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
          spacing={1}
          mt="4px"
        >
          <Typography variant="caption" color="#bebebed1" mt={0.5}>
            {new Date(el.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
            {/* Adjust the timestamp format as needed */}
          </Typography>

          {el.outgoing && (
            <Box display="flex" alignItems="center">
              {el.status === "Sent" && <IoCheckmark style={iconStyle} />}{" "}
              {/* Tick */}
              {el.status === "Delivered" && (
                <IoCheckmarkDoneOutline style={iconStyle} />
              )}{" "}
              {/* Double Tick */}
              {el.status === "Seen" && (
                <IoCheckmarkDoneOutline style={iconStyle} />
              )}{" "}
              {/* Green Double Tick */}
            </Box>
          )}
        </Stack>
      </Box>

      {/* {menu && <textOption />} */}
    </Stack>
  );
};
const MediaMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={1}>
          <img
            src={el.img}
            alt={el.text}
            style={{ maxHeight: 210, borderRadius: "10px" }}
          />
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.text}
          </Typography>
        </Stack>
      </Box>
      {/* {menu && <textOption />} */}
    </Stack>
  );
};
const DocMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="row"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <BsImage size={48} />
            <Typography variant="caption">Abstract.png</Typography>
            <IconButton>
              <BsDownload />
            </IconButton>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.text}
          </Typography>
        </Stack>
      </Box>
      {/* {menu && <textOption />} */}
    </Stack>
  );
};
const LinkMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.default, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="start"
            sx={{
              backgroundColor: theme.palette.background.paper,
              borderRadius: 1,
            }}
          >
            <Stack direction={"column"} spacing={2}>
              <Embed
                width="300px"
                isDark
                url={`https://youtu.be/xoWxBR34qLE`}
              />
            </Stack>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            <div dangerouslySetInnerHTML={{ __html: el.text }}></div>
          </Typography>
        </Stack>
      </Box>
      {/* {menu && <textOption />} */}
    </Stack>
  );
};
const ReplyMsg = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" justifyContent={el.incoming ? "start" : "end"}>
      <Box
        px={1.5}
        py={1.5}
        sx={{
          backgroundColor: el.incoming
            ? alpha(theme.palette.background.paper, 1)
            : theme.palette.primary.main,
          borderRadius: 1.5,
          width: "max-content",
        }}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction="column"
            spacing={3}
            alignItems="center"
            sx={{
              backgroundColor: alpha(theme.palette.background.paper, 1),

              borderRadius: 1,
            }}
          >
            <Typography variant="body2" color={theme.palette.text}>
              {el.text}
            </Typography>
          </Stack>
          <Typography
            variant="body2"
            color={el.incoming ? theme.palette.text : "#fff"}
          >
            {el.reply}
          </Typography>
        </Stack>
      </Box>
      {/* {menu && <textOption />} */}
    </Stack>
  );
};
const Timeline = ({ el }) => {
  const theme = useTheme();
  return (
    <Stack direction="row" alignItems={"center"} justifyContent="space-between">
      <Divider width="46%" />
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {el.text}
      </Typography>
      <Divider width="46%" />
    </Stack>
  );
};

export { Timeline, MediaMsg, LinkMsg, DocMsg, TextMsg, ReplyMsg };
