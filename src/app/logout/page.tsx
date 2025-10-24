"use client"; // bắt buộc

export default function LogoutButton() {
  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <button
      onClick={handleLogout}
      className=" text-white text-sm"
    >
      Logout
    </button>
  );
}
