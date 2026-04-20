import { Booking, Service, Staff } from "@/types/admin";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

/**
 * Validates if the given time slot works for the designated staff member.
 */
export function checkSlotConflict(
  staffId: string,
  date: string,
  startTime: string,
  durationMinutes: number,
  existingBookings: Booking[]
): boolean {
  const newStart = dayjs(`${date}T${startTime}`);
  const newEnd = newStart.add(durationMinutes, 'minute');

  const staffBookings = existingBookings.filter(b => b.staffId === staffId && b.date === date && b.status !== "Cancelled");
  
  for (const b of staffBookings) {
    // For simplicity, assume all existing bookings are 30 mins, but we should fetch service duration
    // Here we'll just mock a fixed duration conflict check for the example logic.
    const bStart = dayjs(`${b.date}T${b.time}`);
    const bEnd = bStart.add(30, 'minute'); // A safer approach is retrieving service duration.

    // If new booking overlaps with existing
    if ((newStart.isSameOrBefore(bStart) && newEnd.isAfter(bStart)) ||
        (newStart.isBefore(bEnd) && newEnd.isSameOrAfter(bEnd)) ||
        (newStart.isSameOrAfter(bStart) && newEnd.isSameOrBefore(bEnd))) {
      return true; // Conflict found
    }
  }

  return false; // No conflict
}

/**
 * Returns available time slots for a specific date and staff.
 */
export function generateAvailableSlots(
  staff: Staff,
  date: string,
  durationMinutes: number,
  existingBookings: Booking[]
): string[] {
  const slots: string[] = [];
  const startWork = dayjs(`${date}T${staff.workingStartTime}`);
  const endWork = dayjs(`${date}T${staff.workingEndTime}`);
  
  let currentSlot = startWork;

  while (currentSlot.add(durationMinutes, 'minute').isSameOrBefore(endWork)) {
    const slotString = currentSlot.format("HH:mm");
    
    // Check if slot has conflict
    const hasConflict = checkSlotConflict(staff.id, date, slotString, durationMinutes, existingBookings);
    
    if (!hasConflict) {
      slots.push(slotString);
    }
    
    // increment by 30 mins
    currentSlot = currentSlot.add(30, 'minute');
  }

  return slots;
}

/**
 * Retrieve calendar event representations for the availability UI.
 */
export function getStaffScheduleEvents(
  staffList: Staff[],
  bookings: Booking[],
  servicesList: Service[]
) {
  // convert bookings into FullCalendar events format
  return bookings.filter(b => b.status !== "Cancelled").map(b => {
    const staff = staffList.find(s => s.id === b.staffId);
    const service = servicesList.find(s => s.id === b.serviceId);
    
    return {
      id: b.id,
      title: `${service?.name || 'Service'} - ${staff?.name || 'Staff'}`,
      start: `${b.date}T${b.time}:00`,
      end: `${b.date}T${dayjs(`${b.date}T${b.time}`).add(service?.duration || 30, 'minute').format("HH:mm:00")}`,
      backgroundColor: b.status === 'Completed' ? '#3C50E0' : (b.status === 'Confirmed' ? '#10B981' : '#F59E0B'),
      borderColor: 'transparent'
    };
  });
}
