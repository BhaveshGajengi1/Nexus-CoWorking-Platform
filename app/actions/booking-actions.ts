'use client'

import { supabase } from '@/lib/supabase'

export interface BookingInput {
  room_name: string
  member_name: string
  center_id: string
  booking_date: string
  start_time: string
  end_time: string
  booking_type: string
  notes?: string | null
}

export async function createBooking(booking: BookingInput) {
  try {
    // Check for time conflicts on room_name and booking_date (skip center_id which may have UUID validation issues)
    const { data: conflictingBookings, error: conflictError } = await supabase
      .from('bookings')
      .select('*')
      .eq('room_name', booking.room_name)
      .eq('booking_date', booking.booking_date)

    if (conflictError) {
      console.error('[v0] Conflict check error:', conflictError)
      return {
        success: false,
        error: `Error checking conflicts: ${conflictError.message}`
      }
    }

    // Check for time overlaps
    const startHour = parseInt(booking.start_time.split(':')[0])
    const endHour = parseInt(booking.end_time.split(':')[0])

    const hasConflict = conflictingBookings?.some(b => {
      const existingStart = parseInt(b.start_time.split(':')[0])
      const existingEnd = parseInt(b.end_time.split(':')[0])
      return !(endHour <= existingStart || startHour >= existingEnd)
    })

    if (hasConflict) {
      return {
        success: false,
        error: 'This time slot is already booked'
      }
    }

    // Insert the booking - use single object format (not array)
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        room_name: booking.room_name,
        member_name: booking.member_name,
        center_id: booking.center_id,
        booking_date: booking.booking_date,
        start_time: booking.start_time,
        end_time: booking.end_time,
        booking_type: booking.booking_type,
        notes: booking.notes ? booking.notes : null
      })

    if (error) {
      console.error('[v0] Insert error:', error)
      return {
        success: false,
        error: `Failed to create booking: ${error.message}`
      }
    }

    return {
      success: true,
      data: data,
      message: 'Booking created successfully'
    }
  } catch (error) {
    console.error('[v0] Booking error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}
