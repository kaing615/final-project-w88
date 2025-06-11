import { Grid } from "@mui/material";
import MediaItem from "./MediaItem";

const MediaGrid = ({ medias, mediaType }) => (
  <Grid container spacing={3} justifyContent="center">
    {medias.map((media, idx) => (
      <Grid
        item
        xs={6}
        sm={4}
        md={3}
        lg={2}
        key={media.id || idx}
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "30px",
          marginBottom: "30px",
        }}
      >
        <MediaItem media={media} mediaType={mediaType} width="300px" />
      </Grid>
    ))}
  </Grid>
);

export default MediaGrid;
