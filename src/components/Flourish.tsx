// A sprig of leaves with a small star, drawn beside the home title. Purely
// decorative: hidden from assistive technology and never focusable.
export function Flourish({ mirrored = false }: { mirrored?: boolean }) {
  return (
    <svg
      className={mirrored ? 'flourish flourish-mirrored' : 'flourish'}
      viewBox="0 0 64 32"
      aria-hidden="true"
      focusable="false"
    >
      <path className="flourish-stem" d="M60 20C48 21 36 19 24 13" />
      <path className="flourish-leaf" d="M50 20.5c-2-4.5-6.5-6-10-5 1.5 4 5.5 6 10 5z" />
      <path className="flourish-leaf" d="M40 18.5c1-4-1-8-4.5-9.5-1 4 .5 8 4.5 9.5z" />
      <path className="flourish-leaf" d="M32 15.5c-2.5-3-6.5-3.5-9.5-2 2 3 6 4 9.5 2z" />
      <path className="flourish-star" d="M12 8l1.4 3.6L17 13l-3.6 1.4L12 18l-1.4-3.6L7 13l3.6-1.4z" />
      <circle className="flourish-star" cx="20" cy="6" r="1.2" />
      <circle className="flourish-star" cx="5" cy="21" r="1" />
    </svg>
  )
}
