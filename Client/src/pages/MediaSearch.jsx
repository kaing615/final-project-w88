import {
  Box,
  Button,
  Stack,
  TextField,
  Toolbar,
  CircularProgress,
  Typography,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import mediaApi from "../api/modules/media.api";
import MediaGrid from "../components/common/MediaGrid";
import uiConfigs from "../configs/ui.configs";

const mediaTypes = ["movie", "tv", "people"];
const timeout = 500;

const MediaSearch = () => {
  const [query, setQuery] = useState("");
  const [onSearch, setOnSearch] = useState(false);
  const [mediaType, setMediaType] = useState(mediaTypes[0]);
  const [medias, setMedias] = useState([]);
  const [page, setPage] = useState(1);

  const timerRef = useRef();

  // Fetch search result khi đổi query, type, hoặc page
  useEffect(() => {
    const fetchSearch = async () => {
      if (query.trim().length === 0) {
        setMedias([]);
        return;
      }
      setOnSearch(true);
      const { response, err } = await mediaApi.search({
        mediaType,
        query,
        page,
      });
      setOnSearch(false);

      if (err) toast.error(err.message);
      if (response && response.data && Array.isArray(response.data.results)) {
        if (page === 1) setMedias([...response.data.results]);
        else setMedias((m) => [...m, ...response.data.results]);
      }
    };
    fetchSearch();
    // eslint-disable-next-line
  }, [mediaType, query, page]);

  // Khi đổi type hoặc query, reset page về 1
  useEffect(() => {
    setPage(1);
  }, [mediaType, query]);

  const onCategoryChange = (selectedCategory) => setMediaType(selectedCategory);

  const onQueryChange = (e) => {
    const newQuery = e.target.value;
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setQuery(newQuery);
    }, timeout);
  };

  const handleLoadMore = () => setPage((prev) => prev + 1);

  return (
    <>
      <Toolbar />
      <Box sx={{ ...uiConfigs.style.mainContent }}>
        <Stack spacing={2}>
          {/* Category Buttons */}
          <Stack
            spacing={2}
            direction={"row"}
            justifyContent={"center"}
            sx={{ width: "100%" }}
          >
            {mediaTypes.map((item, index) => (
              <Button
                size="large"
                key={index}
                variant={mediaType === item ? "contained" : "text"}
                sx={{
                  color:
                    mediaType === item
                      ? "primary.contrastText"
                      : "text.primary",
                }}
                onClick={() => onCategoryChange(item)}
              >
                {item}
              </Button>
            ))}
          </Stack>
          {/* Search box */}
          <TextField
            color="success"
            placeholder="Search Streamix"
            sx={{ width: "100%" }}
            autoFocus
            onChange={onQueryChange}
          />

          <Box
            minHeight={350}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            {onSearch && page === 1 ? (
              <CircularProgress size={48} thickness={4} color="success" />
            ) : (
              <Box width="100%">
                <MediaGrid
                  medias={medias}
                  mediaType={mediaType}
                  query={query}
                />
                {!onSearch &&
                  medias.length === 0 &&
                  query.trim().length > 0 && (
                    <Typography
                      mt={3}
                      textAlign="center"
                      fontSize={20}
                      fontWeight={500}
                      color="text.secondary"
                    >
                      Not Found!
                    </Typography>
                  )}
              </Box>
            )}
          </Box>

          {medias.length > 0 && (
            <LoadingButton
              loading={onSearch && page > 1}
              onClick={handleLoadMore}
            >
              Load More
            </LoadingButton>
          )}
        </Stack>
      </Box>
    </>
  );
};

export default MediaSearch;
