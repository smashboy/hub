import { Global } from "@emotion/react"
import { styled } from "@mui/material/styles"
import { Container, Box, CssBaseline, SwipeableDrawer as MUISwipeableDrawer } from "@mui/material"
import { grey } from "@mui/material/colors"

const Puller = styled(Box)(({ theme }) => ({
  width: 30,
  height: 6,
  backgroundColor: theme.palette.mode === "light" ? grey[300] : grey[700],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
}))

type SwipeableDrawerProps = {
  open: boolean
  drawerBleeding?: number
  onOpen: () => void
  onClose: () => void
}

const SwipeableDrawer: React.FC<SwipeableDrawerProps> = ({
  open,
  onOpen,
  onClose,
  drawerBleeding = 0,
  children,
}) => {
  return (
    <>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(80% - ${drawerBleeding}px)`,
            overflow: "visible",
            background: "#212121",
          },
        }}
      />

      <MUISwipeableDrawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        onOpen={onOpen}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: "100%",
            height: "100%",
            top: drawerBleeding === 0 && open ? -56 : -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            bgcolor: "#212121",
            right: 0,
            left: 0,
          }}
        >
          <Puller />
        </Box>
        <Container disableGutters>{children}</Container>
      </MUISwipeableDrawer>
    </>
  )
}

export default SwipeableDrawer
