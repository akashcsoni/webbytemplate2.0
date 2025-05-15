export default async function DynamicPage({ params }) {
    const { pageSlug, itemSlug, categorySlug } = params;
    return (
        <>
            <div>
                <p>pageSlug: {pageSlug}</p>
                <p>itemSlug: {itemSlug}</p>
                <p>categorySlug: {categorySlug}</p>
            </div>
        </>
    )
}
