import { Button, Grid } from "@mui/material";
import { useEffect, useState } from "react";
import tmdbConfigs from "../../api/configs/tmdb.configs";
import personApi from "../../api/modules/person.api";
import MediaItem from "./MediaItem";
import { toast } from "react-toastify";

const PersonMediaGrid = ({ personId }) => {
  const [medias, setMedias] = useState([]);
  const [filteredMedias, setFilteredMedias] = useState([]);
  const [page, setPage] = useState(1);
  const skip = 8;

  useEffect(() => {
    const getMedias = async () => {
      const { response, error } = await personApi.medias({ personId });
      console.log("response:", response, "error:", error);

      if (error) toast.error(error.message);

      if (response && Array.isArray(response.data?.cast)) {
        const mediasSorted = response.data.cast.sort(
          (a, b) => getReleaseDate(b) - getReleaseDate(a)
        );
        setMedias([...mediasSorted]);
        setFilteredMedias([...mediasSorted].splice(0, skip));
        console.log("API Response (have cast):", response);
      } else {
        setMedias([]);
        setFilteredMedias([]);
        console.log("API Response (no cast):", response);
      }
    };

    getMedias();
  }, [personId]);

  const getReleaseDate = (media) => {
    const date =
      media.media_type === tmdbConfigs.mediaType.movie
        ? new Date(media.release_date)
        : new Date(media.first_air_date);
    return date.getTime();
  };

  const onLoadMore = () => {
    setFilteredMedias([
      ...filteredMedias,
      ...[...medias].splice(page * skip, skip),
    ]);
    setPage(page + 1);
  };

  return (
    <>
      <Grid container spacing={3} justifyContent="center">
        {filteredMedias.map((media, idx) => (
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
            <MediaItem
              media={media}
              mediaType={media.media_type}
              width="300px"
            />
          </Grid>
        ))}
      </Grid>

      {filteredMedias.length < medias.length && (
        <Button onClick={onLoadMore}>Load More</Button>
      )}
    </>
  );
};

export default PersonMediaGrid;
