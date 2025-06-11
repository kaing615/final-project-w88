import { LoadingButton } from "@mui/lab";
import { Box, Button, Divider, Stack, Typography, Avatar } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import tmdbConfigs from "../api/configs/tmdb.configs";
import reviewApi from "../api/modules/review.api";
import Container from "../components/common/Container";
import uiConfigs from "../configs/ui.configs";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import { routesGen } from "../routes/routes";
import MovieIcon from "@mui/icons-material/Movie";

const ReviewItem = ({ review, onRemoved }) => {
  const [onRequest, setOnRequest] = useState(false);

  const onRemove = async () => {
    setOnRequest(true);
    const { response, err } = await reviewApi.remove({
      reviewId: review.id,
    });
    setOnRequest(false);

    if (err) toast.error(err.message);
    if (response) {
      toast.success("Remove review success");
      onRemoved(review.id);
    }
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        alignItems: { md: "flex-start" },
        borderRadius: 3,
        boxShadow: 2,
        p: 2,
        transition: "box-shadow 0.3s, background 0.3s",
        "&:hover": {
          boxShadow: 6,
          bgcolor: "background.paper",
        },
        opacity: onRequest ? 0.7 : 1,
        minHeight: 160,
        mb: 2,
      }}
    >
      <Box sx={{ width: { xs: "100%", md: 120 }, minWidth: 90, mr: { md: 2 } }}>
        <Link
          to={routesGen.mediaDetail(review.mediaType, review.mediaid)}
          style={{ color: "unset", textDecoration: "none" }}
        >
          {review.mediaPoster ? (
            <Box
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: 1,
                width: 90,
                height: 130,
                background: "#eee",
                ...uiConfigs.style.backgroundImage(
                  tmdbConfigs.posterPath(review.mediaPoster)
                ),
              }}
            />
          ) : (
            <Avatar
              sx={{
                width: 90,
                height: 130,
                borderRadius: 2,
                fontSize: 48,
                bgcolor: "grey.300",
              }}
              variant="rounded"
            >
              <MovieIcon fontSize="inherit" />
            </Avatar>
          )}
        </Link>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 1,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link
            to={routesGen.mediaDetail(review.mediaType, review.mediaid)}
            style={{ color: "unset", textDecoration: "none" }}
          >
            <Typography
              variant="h6"
              sx={{ ...uiConfigs.style.typoLines(1, "left") }}
            >
              {review.mediaTitle}
            </Typography>
          </Link>
          <LoadingButton
            variant="text"
            color="error"
            size="small"
            sx={{
              minWidth: 36,
              ml: 2,
              position: { xs: "static", md: "absolute" },
              top: { md: 16 },
              right: { md: 16 },
              borderRadius: 2,
            }}
            startIcon={<DeleteIcon />}
            loading={onRequest}
            onClick={onRemove}
          >
            <Typography sx={{ display: { xs: "none", md: "block" } }}>
              Remove
            </Typography>
          </LoadingButton>
        </Stack>
        <Typography
          variant="body2"
          color="text.secondary"
          fontStyle="italic"
          sx={{ fontSize: "0.93rem" }}
        >
          {dayjs(review.createdAt).format("DD/MM/YYYY HH:mm")}
        </Typography>
        <Typography variant="body1">{review.content}</Typography>
      </Box>
    </Box>
  );
};

const ReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const [filteredReviews, setFilteredReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch();

  const skip = 4; // Hiện 4 review/lần cho đẹp

  useEffect(() => {
    const getReviews = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await reviewApi.getList();
      dispatch(setGlobalLoading(false));
      if (err) toast.error(err.message || "Failed to load reviews");
      if (response) {
        setCount(response.data.length);
        setReviews([...response.data]);
        setFilteredReviews([...response.data].slice(0, skip));
      }
    };
    getReviews();
    // eslint-disable-next-line
  }, []);

  const onLoadMore = () => {
    setFilteredReviews([
      ...filteredReviews,
      ...reviews.slice(page * skip, (page + 1) * skip),
    ]);
    setPage(page + 1);
  };

  const onRemoved = (id) => {
    const newReviews = reviews.filter((e) => e.id !== id);
    setReviews(newReviews);
    setFilteredReviews(newReviews.slice(0, page * skip));
    setCount(count - 1);
  };

  return (
    <Box sx={{ ...uiConfigs.style.mainContent }}>
      <Container header={`Your Reviews (${count})`}>
        <Stack spacing={2}>
          {filteredReviews.length === 0 && (
            <Typography
              align="center"
              color="text.secondary"
              fontStyle="italic"
              sx={{ py: 5 }}
            >
              You have no reviews yet.
            </Typography>
          )}
          {filteredReviews.map((item) => (
            <Box key={item.id}>
              <ReviewItem review={item} onRemoved={onRemoved} />
              <Divider sx={{ display: { xs: "block", md: "none" } }} />
            </Box>
          ))}
          {filteredReviews.length < reviews.length && (
            <Button
              onClick={onLoadMore}
              variant="outlined"
              sx={{
                mt: 2,
                borderRadius: 8,
                textTransform: "none",
                fontWeight: 600,
                alignSelf: "center",
                px: 4,
                boxShadow: 1,
                transition: "all 0.2s",
                "&:hover": { boxShadow: 4, borderColor: "primary.main" },
              }}
            >
              Load More
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
};

export default ReviewList;
