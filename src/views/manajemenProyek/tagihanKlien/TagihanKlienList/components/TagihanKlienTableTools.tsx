import TagihanKlienTableSearch from './TagihanKlienTableSearch'

const TagihanKlienTableTools = () => {
    return (
        <div className="flex flex-col lg:flex-row lg:items-center">
            <TagihanKlienTableSearch />
            {/* <TagihanKlienFilter /> */}
            {/* <Link
                download
                className="block lg:inline-block md:mx-2 md:mb-0 mb-4"
                to="/data/product-list.csv"
                target="_blank"
            >
                <Button block size="sm" icon={<HiDownload />}>
                    Export
                </Button>
            </Link> */}
            {/* <Link
                className="block lg:inline-block md:mb-0 mb-4 md:ml-2 "
                to="/master/tagihan-klien-new"
            >
                <Button block variant="solid" size="sm" icon={<HiPlusCircle />}>
                    Tambah TagihanKlien
                </Button>
            </Link> */}
        </div>
    )
}

export default TagihanKlienTableTools
