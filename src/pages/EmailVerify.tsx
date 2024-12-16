import React, { useState, useEffect } from "react";
import { Button, Paper, Typography, CircularProgress, Box } from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { FaArrowCircleLeft } from "react-icons/fa";
import "react-toastify/dist/ReactToastify.css";
import verifyEmail from "../assets/images/verifyEmail2.png";
import { axiosClient } from "../libraries/axiosClient";
 // Đảm bảo axiosClient đã được cài đặt đúng

export default function VerifyEmail() {
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const { userId, unique_string } = useParams(); // Lấy id và mã xác thực từ URL
  const navigate = useNavigate();

  useEffect(() => {
    // Kiểm tra xác thực email khi component được mount
    const handleVerifyEmail = async () => {
      try {
        const response = await axiosClient.get(`/auth/verify-email/${userId}/${unique_string}`);
        if (response.status === 200) {
          setIsVerified(true);
          toast.success("Email của bạn đã được xác thực thành công!");
        } else {
          setIsVerified(false);
          toast.error("Mã xác thực không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.");
        }
      } catch (error) {
        setIsVerified(false);
        toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
      } finally {
        setIsVerifying(false); // Đổi trạng thái sau khi xác thực
      }
    };

    handleVerifyEmail(); // Gọi hàm xác thực
  }, [userId, unique_string]); // Đảm bảo useEffect được gọi lại khi thay đổi tham số URL

  return (
    <div className="flex flex-col items-center h-screen justify-center p-6 bg-gray-200">
      <ToastContainer />
      <Paper
        className="w-full max-w-[600px] p-[3rem]"
        elevation={4}
        sx={{
          borderRadius: "20px",
          overflow: "hidden",
          boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
          position: "relative",
          background: "#ffffff",
        }}
      >
        {/* Back button */}
        <Link to="/signup" style={{ position: "absolute", top: "20px", left: "20px", fontSize: "30" }}>
          <FaArrowCircleLeft className="text-blue-1000 cursor-pointer text-3xl" />
        </Link>

        {/* Header Image */}
        <img
          src={verifyEmail}
          alt="Email Verification"
          style={{
            width: "100%",
            height: "240px",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />

        {/* Content */}
        <div className="text-center mt-6">
          <Typography variant="h6" color="primary" fontWeight="bold" sx={{ lineHeight: "1.5" }}>
            Xác Thực Email
          </Typography>
          <Typography
            variant="body1"
            color="textSecondary"
            sx={{
              marginTop: "10px",
              lineHeight: "1.8",
              fontSize: "1rem",
            }}
          >
            {/* Nội dung mô tả (nếu có) */}
          </Typography>

          {isVerifying ? (
            <Box sx={{ marginTop: "20px" }}>
              <Typography
                variant="body1"
                color="textSecondary"
                sx={{ fontSize: "1.1rem", marginBottom: "10px" }}
              >
                Đang kiểm tra xác thực email của bạn...
              </Typography>
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress size={40} />
              </Box>
            </Box>
          ) : isVerified ? (
            <Box sx={{ marginTop: "20px" }}>
              <Typography
                variant="h6"
                color="green"
                sx={{ marginBottom: "15px", fontWeight: "bold" }}
              >
                Email của bạn đã được xác thực thành công!
              </Typography>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                  marginTop: "15px",
                }}
              >
                <Link to="/login" style={{ color: "white", textDecoration: "none" }}>
                  Đăng nhập ngay
                </Link>
              </Button>
            </Box>
          ) : (
            <Box sx={{ marginTop: "20px" }}>
              <Typography
                variant="h6"
                color="red"
                sx={{ marginBottom: "15px", fontWeight: "bold" }}
              >
                Xác thực email không thành công. Vui lòng thử lại.
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                sx={{
                  padding: "12px 24px",
                  borderRadius: "10px",
                  fontWeight: "bold",
                  fontSize: "1rem",
                }}
                onClick={() => window.location.reload()}
              >
                Thử lại
              </Button>
            </Box>
          )}
        </div>
      </Paper>
    </div>
  );
}
