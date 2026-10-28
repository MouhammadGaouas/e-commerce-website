Act as a senior product designer and senior frontend engineer with exceptional UI/UX skills.

I am not satisfied with the current user profile page. I want you to critically evaluate the existing design and redesign it into a polished, professional, production-quality interface.

IMPORTANT: Do not simply change the colors, spacing, or border radius of the existing design. Rethink the page's visual composition, information hierarchy, layout, and user experience.

## Step 1: Analyze Before Coding

Before making any changes:

- Inspect the existing user profile page and its related components.
- Understand the application's purpose, target audience, and overall visual identity.
- Examine the existing design system, typography, colors, spacing, and navigation.
- Identify what makes the current page look generic, cluttered, outdated, or poorly designed.
- Understand the existing user data and available profile functionality.
- Inspect other pages to ensure the redesigned profile remains consistent with the rest of the application.

Do not modify the code until you understand the current implementation.

## Step 2: Redesign the Visual Experience

Create a clear and intentional design direction.

Focus on:

- A strong visual hierarchy that makes important information easy to scan.
- Thoughtful typography with appropriate font sizes, weights, and line heights.
- Balanced spacing and precise alignment.
- A well-structured layout that uses available screen space effectively.
- A professional presentation of the user's avatar, name, email, role, and relevant profile information.
- Clear separation between profile information, account preferences, security settings, and other relevant sections.
- Consistent component styling without making every element look identical.
- Subtle borders, restrained shadows, and appropriate surface contrast.
- Carefully designed buttons, form fields, dropdowns, and interactive states.

Do not force every piece of information into a card.

Use cards, dividers, sections, or other layouts only when they improve the information hierarchy.

## Step 3: Avoid Generic AI-Generated Design

Avoid blindly applying these patterns:

- Excessive rounded cards.
- Purple or blue gradients without a reason.
- Large empty hero sections that waste space.
- Too many decorative icons.
- Repeated card grids.
- Unnecessary glassmorphism.
- Excessive badges and status labels.
- Oversized headings that dominate the entire page.
- Random animations and hover effects.
- Decorative elements that do not help the user.

The result should feel intentionally designed for this specific application rather than generated from a generic dashboard template.

## Step 4: Improve the User Experience

Evaluate the page from the user's perspective.

- Make the most important profile information immediately visible.
- Make editing profile information intuitive.
- Clearly distinguish editable fields from read-only information.
- Provide clear save, cancel, loading, success, and error states where appropriate.
- Ensure destructive actions are clearly distinguished from normal actions.
- Prevent accidental data loss when users edit their information.
- Preserve existing authentication, authorization, and validation rules.
- Do not introduce fake functionality or placeholder data.

Only include sections that are relevant to the application's actual features.

## Step 5: Responsive Design and Accessibility

Ensure the redesigned page works well on:

- Mobile phones.
- Tablets.
- Desktop screens.

Check for:

- Horizontal overflow.
- Incorrect spacing at smaller widths.
- Broken forms or buttons.
- Accessible labels and keyboard navigation.
- Visible focus states.
- Sufficient color contrast.

## Step 6: Implementation Requirements

- Preserve the existing framework, architecture, and conventions.
- Reuse existing components when appropriate.
- Avoid unnecessary dependencies.
- Keep components maintainable and appropriately separated.
- Preserve all existing working functionality.
- Do not rewrite unrelated parts of the application.
- Do not invent API endpoints or database fields.
- Follow the project's existing design system or establish consistent tokens if necessary.

## Step 7: Visual Validation

After implementing the redesign:

1. Run the application.
2. Open the profile page in a browser if browser access is available.
3. Inspect the actual rendered interface.
4. Test the page at mobile and desktop widths.
5. Identify visual inconsistencies and usability problems.
6. Refine the implementation until the result is cohesive and polished.
7. Run the available lint, type-check, and build commands.

Do not declare the task complete just because the code compiles.

## Final Objective

Deliver a profile page that looks like the work of an experienced product designer: visually balanced, intuitive, distinctive, accessible, responsive, and consistent with the rest of the application.

Start by analyzing the existing implementation and identifying the main design problems. Then redesign the page and validate the result.