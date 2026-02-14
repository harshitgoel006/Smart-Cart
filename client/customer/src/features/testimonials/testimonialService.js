import { testimonials } from "../../data/testimonials";

/* ===============================
   GET APPROVED TESTIMONIALS
================================ */

export const getApprovedTestimonials = async (limit = 6) => {
  return testimonials
    .filter((t) => t.isApproved)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, limit);
};
