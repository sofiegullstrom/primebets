import { getDay, set, isAfter, isBefore, startOfDay } from 'date-fns'

export interface GameStatus {
    isOpen: boolean
    label: string
    color: string // Tailwind text color class
    borderColor: string // Tailwind border color class
    bgColor: string // Tailwind bg color class
    badgeColor: string // For badge-specific styling
}

export function getGameStatus(raceDateStr: string): GameStatus {
    const now = new Date()
    const raceDate = new Date(raceDateStr)
    const today = startOfDay(now)
    const raceDay = startOfDay(raceDate)

    // Helper for "Closed" state styling
    const closedState: GameStatus = {
        isOpen: false,
        label: 'AVSLUTAT',
        color: 'text-red-400',
        borderColor: 'border-red-500/50',
        bgColor: 'bg-red-500/10',
        badgeColor: 'text-red-500 border-red-500/50'
    }

    // Helper for "Open" state styling
    const openState: GameStatus = {
        isOpen: true,
        label: 'ÖPPET SPEL',
        color: 'text-emerald-400',
        borderColor: 'border-emerald-500/20',
        bgColor: 'bg-emerald-500/10',
        badgeColor: 'text-emerald-400 border-emerald-500/20'
    }

    // 1. If date is in the past (yesterday or older), it involves NO time check. It is closed.
    if (isBefore(raceDay, today)) return closedState

    // 2. If date is in the future (tomorrow or later), it is open.
    if (isAfter(raceDay, today)) return openState

    // 3. If date is TODAY, we check the specific cutoff times.
    const dayOfWeek = getDay(now) // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    let closingTime: Date

    if (dayOfWeek === 6) { // Saturday
        // Closes 19:30
        closingTime = set(now, { hours: 19, minutes: 30, seconds: 0, milliseconds: 0 })
    } else if (dayOfWeek === 0) { // Sunday
        // Closes 18:00
        closingTime = set(now, { hours: 18, minutes: 0, seconds: 0, milliseconds: 0 })
    } else { // Mon - Fri
        // Closes 22:00
        closingTime = set(now, { hours: 22, minutes: 0, seconds: 0, milliseconds: 0 })
    }

    // Compare time
    if (isAfter(now, closingTime)) {
        return closedState
    }

    return openState
}
