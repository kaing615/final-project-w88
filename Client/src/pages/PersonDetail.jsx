import { Box, Toolbar, Typography, Stack, Divider, Chip } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PersonMediaGrid from "../components/common/PersonMediaGrid";
import tmdbConfigs from "../api/configs/tmdb.configs";
import uiConfigs from "../configs/ui.configs";
import Container from "../components/common/Container";
import personApi from "../api/modules/person.api";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setGlobalLoading } from "../redux/features/globalLoadingSlice";

const PersonDetail = () => {
  const dispatch = useDispatch();
  const { personId } = useParams();
  const [person, setPerson] = useState();

  useEffect(() => {
    const getPerson = async () => {
      dispatch(setGlobalLoading(true));
      const { response, err } = await personApi.detail({ personId });
      dispatch(setGlobalLoading(false));
      if (err) toast.error(err.message);
      if (response) setPerson(response);
    };

    getPerson();
  }, [personId]);

  if (!person) return <Toolbar />;

  // Tính tuổi nếu có ngày sinh
  const birthday = person.data.birthday ? new Date(person.data.birthday) : null;
  const deathday = person.data.deathday ? new Date(person.data.deathday) : null;
  const now = new Date();
  let age = "";
  if (birthday) {
    age = deathday
      ? deathday.getFullYear() - birthday.getFullYear()
      : now.getFullYear() - birthday.getFullYear();
  }

  // Nơi sinh
  const placeOfBirth = person.data.place_of_birth || "";

  return (
    <>
      <Toolbar />
      <Box
        sx={{
          ...uiConfigs.style.mainContent,
          mt: 3,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", md: "row" },
            gap: 4,
            alignItems: { md: "flex-start", xs: "center" },
          }}
        >
          {/* Avatar + overlay */}
          <Box
            sx={{
              width: { xs: 180, md: 250 },
              minWidth: 160,
              borderRadius: 3,
              overflow: "hidden",
              boxShadow: 4,
              position: "relative",
            }}
          >
            <Box
              sx={{
                width: "100%",
                pt: "150%",
                backgroundImage: `url(${tmdbConfigs.posterPath(
                  person.data.profile_path
                )})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                filter: "brightness(0.98)",
              }}
            />
            <Box
              sx={{
                position: "absolute",
                bottom: 0,
                width: "100%",
                bgcolor: "rgba(0,0,0,0.48)",
                color: "#fff",
                px: 2,
                py: 0.5,
                fontSize: 16,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              {person.data.name}
            </Box>
          </Box>

          {/* Info */}
          <Box sx={{ flex: 1 }}>
            <Stack spacing={1}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {person.data.name}
                {birthday && (
                  <>
                    {" "}
                    <span style={{ fontWeight: 400, fontSize: 28 }}>
                      ({birthday.getFullYear()}
                      {deathday && ` - ${deathday.getFullYear()}`})
                    </span>
                  </>
                )}
              </Typography>
              <Stack
                direction="row"
                spacing={2}
                alignItems="center"
                flexWrap="wrap"
              >
                {birthday && (
                  <Chip
                    color="primary"
                    label={`Age: ${age}`}
                    size="small"
                    sx={{ fontSize: 16, bgcolor: "#222", color: "#fff" }}
                  />
                )}
                {placeOfBirth && (
                  <Chip
                    label={`Born: ${placeOfBirth}`}
                    size="small"
                    sx={{ fontSize: 16, bgcolor: "#222", color: "#fff" }}
                  />
                )}
              </Stack>
              <Divider sx={{ my: 2, bgcolor: "#111" }} />
              <Typography
                sx={{
                  ...uiConfigs.style.typoLines(12),
                  fontSize: 18,
                  color: "#ddd",
                }}
              >
                {person.data.biography}
              </Typography>
            </Stack>
          </Box>
        </Box>

        <Container header="Medias" sx={{ mt: 6 }}>
          <PersonMediaGrid personId={personId} />
        </Container>
      </Box>
    </>
  );
};

export default PersonDetail;
