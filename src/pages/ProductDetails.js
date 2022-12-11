import {Helmet} from 'react-helmet-async';
// @mui
import {Box, Button, Container, Divider, IconButton, Input, Stack, Typography} from '@mui/material';
import {useEffect, useState} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {styled} from "@mui/material/styles";
import {fCurrency} from "../utils/formatNumber";
import {Icon} from "../components/icon/Icon";
import Label from "../components/label";

const ChevronButton = styled(IconButton)(({theme}) => ({
    width: '40px',
    height: '40px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
}))

function ImageViewer(props) {
    const {images, ...rootProps} = props;
    const MAX_DISPLAY_IMAGES = 5;
    const ACTUAL_DISPLAY_IMAGES = Math.min(MAX_DISPLAY_IMAGES, images.length);
    const [imageRoll, setImageRoll] = useState(() => {
        const arr = [];
        for (let i = 0; i < ACTUAL_DISPLAY_IMAGES; i += 1) {
            arr.push({
                img: images[i],
                id: i
            })
        }
        return arr;
    })

    const [currentImage, setCurrentImage] = useState(0);
    const [imgState, setImgState] = useState({
        backgroundImage: `url(${images[currentImage]})`,
        backgroundPosition: '0% 0%'
    });

    const changeImageRoll = (val) => {
        const start = imageRoll[0].id + val
        const end = imageRoll[ACTUAL_DISPLAY_IMAGES - 1].id + val;
        if (start > -1 && end < images.length) {
            setImageRoll(prev => prev.map(imageRoll => {
                imageRoll.id += val;
                imageRoll.img = images[imageRoll.id];
                return imageRoll;
            }))
        }
    }

    useEffect(() => {
        setImgState({
            ...imgState,
            backgroundImage: `url(${images[currentImage]})`,
        })
    }, [currentImage])

    const handleMouseMove = e => {
        const {left, top, width, height} = e.target.getBoundingClientRect()
        const x = (e.pageX - left) / width * 100
        const y = (e.pageY - top) / height * 100
        setImgState({...imgState, backgroundPosition: `${x}% ${y}%`})
    }

    return <>
        <Stack
            direction="column"
            {...rootProps}
        >
            <Box
                sx={{
                    padding: '5px'
                }}
            >
                <Box
                    onMouseMove={handleMouseMove}
                    sx={{
                        ...imgState,
                        width: '100%',
                        '&:hover *': {
                            opacity: 0
                        }
                    }}
                >
                    <Box
                        component='img' src={images[currentImage]}
                    />
                </Box>
            </Box>
            <Stack
                direction='row'
                sx={{
                    width: '100%',
                    justifyContent: 'center',
                    position: 'relative'
                }}
            >
                {imageRoll.map(({img, id}) => <Box
                        key={id}
                        sx={{
                            width: '20%',
                            margin: '5px',
                            border: id === currentImage ? '2px solid' : 'none',
                            borderColor: 'primary.main'
                        }}
                        component='img' src={img}
                        onMouseEnter={() => setCurrentImage(id)}
                    />
                )}
                <ChevronButton
                    sx={{left: '10px'}}
                    onClick={() => changeImageRoll(-1)}
                >
                    <ChevronLeftIcon
                        sx={{color: 'white'}}
                    />
                </ChevronButton>
                <ChevronButton
                    sx={{right: '10px'}}
                    onClick={() => changeImageRoll(1)}
                >
                    <ChevronLeftIcon
                        sx={{
                            transform: 'rotate(180deg)',
                            color: 'white'
                        }}
                    />
                </ChevronButton>
            </Stack>
        </Stack>
    </>
}

export default function ProductDetails(props) {
    const {product: {name, images, price, discount, quantity, label}} = props;
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const handleChangeQuantity = (val) => {
        const newQuantity = currentQuantity + val;
        if (newQuantity > 0 && newQuantity <= quantity) {
            setCurrentQuantity(newQuantity);
        }
    }
    const imageViewerProps = {
        images,
        sx: {
            width: '450px'
        }
    }

    return (
        <>
            <Helmet>
                <title> Dashboard: Product Details | Minimal UI </title>
            </Helmet>

            <Container>
                <Typography variant="h4" sx={{mb: 5}}>
                    Product Details
                </Typography>
                <Stack
                    direction='row'
                    spacing={3}
                    sx={{mb: 2}}
                >
                    <ImageViewer {...imageViewerProps}/>
                    <Box sx={{flex: 1}}>
                        <Stack direction='row' spacing={2} sx={{alignItems: 'center'}}>
                            <Typography variant="h4" noWrap>
                                {name}
                            </Typography>
                            <Label
                                variant="filled"
                                color={(label === 'sale' && 'error') || 'info'}
                                sx={{
                                    textTransform: 'uppercase',
                                }}
                            >
                                {label}
                            </Label>
                        </Stack>
                        <Divider sx={{mb: 3}}/>
                        <Box>
                            <Typography>
                                List price:&nbsp;
                                <Typography
                                    component="span"
                                    variant="body1"
                                    sx={{
                                        color: 'text.disabled',
                                        textDecoration: 'line-through',
                                    }}
                                >
                                    {discount && fCurrency(discount)}
                                </Typography>
                            </Typography>
                            <Typography>
                                Top deal:&nbsp;
                                <Typography variant="h5" component='span' sx={{color: 'primary.main'}}>
                                    &nbsp;
                                    {fCurrency(price)}
                                </Typography>
                            </Typography>
                            <Typography>
                                You save:&nbsp;
                                <Typography component='span' sx={{color: 'primary.main'}}>
                                    &nbsp;
                                    {fCurrency(price - discount)}
                                    &nbsp;
                                    ({((price - discount) / price * 100).toFixed(2)}%)
                                </Typography>
                            </Typography>
                        </Box>
                        <Stack
                            sx={{mt: 4}}
                            spacing={4}
                            direction='row'
                        >
                            <Stack direction='row'>
                                <Typography
                                    component='span'
                                    sx={{lineHeight: '32px'}}
                                >
                                    Quantity:&nbsp;
                                </Typography>
                                <Button
                                    variant={currentQuantity !== 1 && 'text' || 'disabled'}
                                    size='small'
                                    sx={{
                                        height: '32px',
                                        width: '32px',
                                        minWidth: '32px',
                                    }}
                                    onClick={() => handleChangeQuantity(-1)}
                                >-</Button>
                                <Input
                                    value={currentQuantity}
                                    sx={{
                                        width: '50px',
                                        height: '32px',
                                        '& .MuiInputBase-input': {
                                            textAlign: 'center',
                                        }
                                    }}
                                />
                                <Button
                                    variant={currentQuantity !== quantity && 'text' || 'disabled'}
                                    size='small'
                                    sx={{
                                        height: '32px',
                                        width: '32px',
                                        minWidth: '32px',
                                    }}
                                    onClick={() => handleChangeQuantity(1)}
                                >+</Button>
                            </Stack>

                            <Button
                                variant={
                                    'outlined'
                                }
                                sx={{
                                    width: '175.8px',
                                    height: '46px',
                                    mt: 1
                                }}
                            >
                                <Icon
                                    sx={{
                                        width: '20px',
                                        height: '20px',
                                        marginRight: '10px'
                                    }}
                                >
                                    ic_cart
                                </Icon>
                                Add to cart
                            </Button>
                        </Stack>
                    </Box>
                </Stack>
                <Box>
                    <div>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita, facere id laborum
                        laudantium libero magnam minima neque nulla omnis praesentium quae quas quis rerum, sapiente
                        similique soluta, voluptates. Sit, unde!
                    </div>
                    <div>Asperiores harum hic id, laborum nam non sit. Aperiam, odit tenetur. A alias asperiores culpa
                        dolore doloribus eaque eos hic iusto magnam maxime, nesciunt odio pariatur, placeat ullam
                        veniam. Ut.
                    </div>
                    <div>Aliquid atque, consequatur debitis laborum nam non, omnis pariatur praesentium recusandae totam
                        ullam velit. Blanditiis ipsam molestias numquam vero voluptatem? Cumque dolor dolores ipsa.
                        Asperiores consequuntur earum facere hic reprehenderit!
                    </div>
                    <div>Aliquid commodi, dignissimos excepturi magni nam nulla. Dicta dolores doloribus labore magnam
                        quas quisquam sapiente sint totam ut vero? Culpa cumque molestiae porro quod voluptas!
                        Doloremque illo odio quas vel!
                    </div>
                    <div>Ab amet architecto asperiores aut autem culpa distinctio doloremque doloribus excepturi fugiat
                        iusto libero magni, maiores molestiae mollitia necessitatibus numquam pariatur quaerat qui
                        quibusdam reiciendis sapiente sint sunt tempora veritatis.
                    </div>
                    <div>Ab adipisci quod repudiandae voluptatibus. Aliquid consequuntur corporis dignissimos, dolore
                        doloribus facilis fuga fugiat libero mollitia nisi perferendis quasi quibusdam quo recusandae
                        reiciendis sed sunt temporibus ut velit voluptate! Itaque?
                    </div>
                    <div>Accusamus architecto cum cupiditate deserunt dicta doloremque eaque facere incidunt, itaque
                        iusto libero maxime obcaecati quas recusandae rem similique vero? Cumque et itaque magni natus
                        obcaecati quaerat saepe sint unde.
                    </div>
                    <div>A commodi consequuntur cum cumque, cupiditate deserunt dolorem dolores ducimus eius esse
                        explicabo id impedit laudantium libero maiores maxime mollitia natus nemo nulla omnis quibusdam
                        recusandae sed sint ullam vel!
                    </div>
                    <div>Alias corporis eos error iure mollitia optio quas quo repudiandae sapiente ullam? Atque odio
                        quasi quod vitae! Eaque eligendi, maxime praesentium quos sed unde? Aliquam deleniti ipsum quasi
                        repudiandae. Quo!
                    </div>
                    <div>Aliquid animi architecto blanditiis corporis eaque earum eius et fuga illo illum laboriosam
                        nemo nihil nostrum optio quae, qui quibusdam reprehenderit ut veritatis voluptates? Amet est
                        harum laborum quaerat voluptates.
                    </div>
                    <div>Ad amet architecto at autem consectetur culpa cumque distinctio dolor ex hic minus nihil odio
                        possimus praesentium quaerat, quas quia reprehenderit saepe sunt velit. Esse natus neque porro
                        quas tempore.
                    </div>
                    <div>Corporis culpa deserunt eos necessitatibus odit. A architecto consequatur debitis, deleniti
                        dignissimos dolor doloremque fugiat incidunt modi perferendis perspiciatis quod repellat
                        similique sunt unde ut velit veniam veritatis! Ab, ducimus.
                    </div>
                    <div>Ad, atque corporis debitis doloribus eligendi harum illo labore laboriosam odio possimus
                        provident, quam repudiandae voluptatum? Ab ad aut dignissimos doloremque facere, fugit
                        laboriosam modi neque quia, rem rerum suscipit?
                    </div>
                    <div>Esse nemo optio quaerat sunt? Accusantium aliquid et facere itaque iure laborum magni modi
                        nemo, numquam odio officiis quasi quisquam, quod reiciendis unde? At dolore excepturi facere
                        quas recusandae veniam.
                    </div>
                    <div>A cumque cupiditate deserunt impedit sequi voluptas? Alias assumenda consequatur consequuntur
                        cumque dolor dolores doloribus ducimus est hic illum ipsum itaque laboriosam magni, nostrum
                        obcaecati omnis sed. Ducimus laboriosam, nobis.
                    </div>
                    <div>Aperiam aspernatur, consectetur consequuntur doloremque dolores eveniet excepturi
                        exercitationem fugiat harum libero molestias nemo nisi officia optio ratione sapiente sit sunt
                        velit! Accusamus ad doloribus iusto pariatur vitae voluptatem. Unde?
                    </div>
                    <div>Commodi consequuntur cupiditate debitis, eos expedita placeat quae quam reprehenderit sint sit!
                        Accusamus blanditiis corporis cumque debitis dolor doloremque dolorum earum expedita fugit
                        laborum, minus quasi qui reiciendis ullam voluptatum?
                    </div>
                    <div>Accusantium aut consectetur consequatur delectus dolore esse fuga harum id iste laborum magnam
                        nostrum officia, pariatur porro possimus rem rerum unde veniam, vero, voluptate. Ex laborum
                        officiis provident sequi soluta?
                    </div>
                    <div>Dolore facilis ipsam magnam placeat, quam quidem sed? Aperiam cum cupiditate dignissimos est
                        non sequi? Alias aliquid amet aperiam asperiores at dignissimos eaque et, laboriosam obcaecati
                        odit, saepe suscipit veritatis.
                    </div>
                    <div>Ducimus ipsa quo soluta! Accusamus, alias dignissimos, doloribus eligendi error est
                        exercitationem hic, id in iure libero magnam nihil nostrum placeat quam quo voluptas. Atque
                        eaque earum repudiandae tenetur unde!
                    </div>
                </Box>
            </Container>
        </>
    );
}

ProductDetails.defaultProps = {
    product: {
        name: 'Nike Air Force 1 NDESTRUKT',
        images: [
            '/assets/images/products/product_1.jpg',
            '/assets/images/products/product_2.jpg',
            '/assets/images/products/product_3.jpg',
            '/assets/images/products/product_4.jpg',
            '/assets/images/products/product_5.jpg',
            '/assets/images/products/product_6.jpg',
            '/assets/images/products/product_7.jpg',
        ],
        price: 64.74,
        discount: 28.05,
        quantity: 10,
        label: {
            name: 'sale',
            color: 'error'
        },
        variations: [
            {
                variation: {
                    name: 'Size',
                    variationOptions: [
                        {
                            name: 'Small',
                            charge: 15
                        },
                        {
                            name: 'Medium',
                            charge: 0
                        },
                        {
                            name: 'Large',
                            charge: 30
                        }
                    ]
                },
                quantity: 10
            },
            {
                variation: {
                    name: 'Color',
                    variationOptions: [
                        {
                            name: 'White',
                            charge: 10
                        },
                        {
                            name: 'Black',
                            charge: 50
                        }
                    ]
                },
                quantity: 10
            },
        ]
    }
}
