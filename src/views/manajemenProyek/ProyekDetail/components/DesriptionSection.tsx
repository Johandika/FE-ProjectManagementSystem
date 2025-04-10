import type { ComponentPropsWithoutRef } from 'react'

interface DescriptionSectionProps extends ComponentPropsWithoutRef<'div'> {
    title: string
    desc: string
}

const DescriptionSection = ({
    title,
    desc,
    ...rest
}: DescriptionSectionProps) => {
    return (
        <div {...rest}>
            <h5>{title}</h5>
            <p>{desc}</p>
        </div>
    )
}

export default DescriptionSection
