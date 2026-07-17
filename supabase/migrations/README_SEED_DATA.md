# YUTE Platform Seed Data Guide

This document explains the seed data scripts available for populating the YUTE platform database with realistic sample data for testing, development, and demonstration purposes.

## Overview

The seed data migrations populate the database with comprehensive, realistic South African-focused data across all major platform features:

- **User Profiles**: 10 diverse users with realistic names, phone numbers, and financial goals
- **Stokie Circles**: Sample saving circles with different purposes and configurations
- **Circle Members**: Member relationships across multiple circles
- **Contributions**: Payment records with various statuses
- **Circle Messages**: Active community discussions
- **Payout Proposals**: Sample voting scenarios
- **Learning Platform**: User progress across courses and learning paths
- **Badges & XP**: Achievement tracking and leaderboard data
- **Invites**: Circle invitation examples
- **Notifications**: Sample notification events

## Seed Data Files

### 1. `20250103000001_seed_stokie_circles.sql`
**Purpose**: Seeds 10 initial Stokie Circles (5 public, 5 private)

**Circles Created**:
- December Holiday Fund 2025 (Public, Rotating)
- Startup Capital Squad (Public, Lump Sum)
- Property Investment Circle (Public, Lump Sum)
- Back to School Savings (Public, Rotating)
- Wedding Fund Warriors (Public, Rotating)
- Emergency Fund Collective (Public, Rotating)
- The Inner Circle Investment Club (Private, Lump Sum)
- Family Legacy Fund (Private, Lump Sum)
- Elite Tech Professionals Network (Private, Lump Sum)
- University Alumni Fund (Private, Rotating)

**Features**:
- Realistic target amounts in South African Rand
- Mix of rotating and lump-sum payout types
- Various contribution amounts
- Different goal descriptions

### 2. `20250102000003_seed_courses.sql`
**Purpose**: Populates learning paths with courses

**Learning Paths**:
- **The Rookie Investor** (Free, Beginner): 7 courses on investment basics
- **The Side-Hustle Starter** (Pro, Intermediate): 8 courses on entrepreneurship
- **The Crypto Connoisseur** (Elite, Advanced): 9 courses on cryptocurrency

**Course Types**: Video, Audio, Text, Interactive, Quiz

### 3. `20250104000001_comprehensive_seed_data.sql` (New!)
**Purpose**: Comprehensive seed data across all entities

**What It Seeds**:

#### User Profiles (10 users)
- Thabo Mokwena - Circle creator and active learner
- Naledi Sithole - Entrepreneur and side hustler
- Sipho Dlamini - Conservative saver
- Lerato Nkosi - Young professional
- Mandla Khumalo - Crypto enthusiast
- Zanele Mthembu - Parent and teacher
- Bongani Ndlovu - Retiree planning
- Nomsa Zulu - Healthcare worker
- Sello Mokoena - IT professional
- Khaya Mabaso - Student and freelancer

#### Circle Memberships (35+ relationships)
Distributes users across 6 major circles with various roles (creator, admin, member)

#### Contributions (25+ records)
- Multiple contribution cycles
- Various payment statuses (completed, pending)
- Payment references
- Timestamp spread over past 30 days

#### Circle Messages (15+ messages)
- Realistic conversations
- Planning discussions
- Reminders and updates
- Community engagement

#### Payout Proposals (2 proposals)
- 1 pending rotating payout with votes
- 1 approved emergency payout

#### User XP & Learning Progress
- XP levels ranging from 1 to 16
- Streak days tracking
- 30+ course progress records
- Completed and in-progress courses

#### Badge Awards (20+ awards)
- First Steps
- Knowledge Seeker
- XP Champion
- Streak Master

#### Circle Invites (3 invites)
- Pending invitations
- Various circle types

#### Notifications (6+ notifications)
- Different notification types
- Various statuses (sent, read)
- Realistic timestamps

## Requirements

**Prerequisites**:
- At least 10 users must exist in `auth.users` table
- All schema migrations must be run before seed data
- Tables must exist: profiles, stokie_circles, circle_members, contributions, learning_paths, courses, etc.

**Safe to Run Multiple Times**:
All seed scripts use conflict handling (`ON CONFLICT DO NOTHING` or `ON CONFLICT DO UPDATE`) so they can be run multiple times without errors.

## How to Use

### Apply All Migrations (Including Seed Data)
```bash
# Using Supabase CLI
supabase db reset  # Resets and applies all migrations

# Or apply specific migration
supabase db push
```

## Data Volume

**Total Records**: ~150+ across all tables
- 10 User profiles
- 10 Stokie circles
- 35+ Circle memberships
- 25+ Contributions
- 15+ Messages
- 30+ Course progress records
- 20+ Badge awards
- Multiple payout proposals and votes
- Notification preferences and sample notifications

## Realistic Features

✓ **South African Context**: Names, phone numbers (+27), Rand amounts  
✓ **Diverse Scenarios**: Various financial goals and risk tolerances  
✓ **Active Community**: Realistic messages and engagement  
✓ **Progressive Learning**: Users at different learning stages  
✓ **Real-world Use Cases**: Holiday savings, property investment, education, emergencies  
✓ **Payment Flows**: Mix of completed and pending contributions  
✓ **Voting Scenarios**: Both pending and approved payout proposals  

## Testing Use Cases

This seed data enables testing of:

1. **Circle Management**: View circles, join/leave, create new ones
2. **Contributions**: Make payments, track history
3. **Messaging**: Post and read circle messages
4. **Voting**: Vote on payout proposals, see results
5. **Learning**: Start courses, track progress, earn badges
6. **Leaderboard**: View rankings, compete with others
7. **Notifications**: Receive and manage notifications
8. **User Profiles**: View and edit profile information

## Customization

To customize seed data:

1. **Edit Amounts**: Modify target_amount, monthly_contribution values
2. **Add More Users**: Extend the user profile sections
3. **Create New Circles**: Add more circle scenarios
4. **Adjust Dates**: Change contribution_date and created_at timestamps
5. **Add Messages**: Insert more realistic conversation threads

## Notes

- All data is for **testing and demonstration only**
- Email addresses use placeholder domains (@example.com)
- Phone numbers are in valid South African format but not real
- Financial amounts are realistic for South African context
- Timestamps are relative (NOW() - INTERVAL) for current relevance

## Support

For issues or questions about seed data:
1. Check that all schema migrations ran successfully
2. Verify auth.users table has at least 10 users
3. Review Supabase logs for specific error messages
4. Ensure RLS policies are correctly configured
