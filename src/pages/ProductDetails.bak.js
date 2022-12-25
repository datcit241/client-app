import {Helmet} from 'react-helmet-async';
// @mui
import {
    Box,
    Button,
    Container,
    Divider,
    IconButton,
    Input,
    Rating,
    Stack,
    ToggleButton,
    ToggleButtonGroup,
    Typography
} from '@mui/material';
import {useEffect, useState} from "react";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import {styled} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {isNull} from "lodash";
import {fCurrency} from "../utils/formatNumber";
import {Icon} from "../components/icon/Icon";
import Label from "../components/label";
import CartWidget from "../sections/@dashboard/products/ProductCartWidget";

const ChevronButton = styled(IconButton)(({theme}) => ({
    width: '40px',
    height: '40px',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
}))

export default function ProductDetails(props) {
    const {product: {name, images, price, discount, quantity, label, description, variations}} = props;
    const [selectedVariations, setSelectedVariations] = useState(() => {
        const initial = {};
        variations.forEach(variation => {
            // initial[variation.name] = Math.floor(variation.variationOptions.length / 2)
            initial[variation.name] = null
        })
        return initial;
    })

    const largeScreen = useMediaQuery(theme => theme.breakpoints.up('md'));

    const imageViewerProps = {
        images,
        sx: {
            maxWidth: '450px'
        }
    }

    const Prices = (props) => {
        const {...rootProps} = props;

        const [charge, setCharge] = useState(0)

        useEffect(() => {
            let ans = 0;
            Object.values(selectedVariations).forEach((variation, index) => {
                ans += isNull(variation) ? 0 : variations[index].variationOptions[variation].charge;
            })
            setCharge(ans)
            console.log(charge)
        }, [selectedVariations])

        return <Box {...rootProps}>
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
                    {fCurrency(price + charge)}
                </Typography>
            </Typography>
            <Typography>
                Top deal:&nbsp;
                <Typography variant="h5" component='span' sx={{color: 'primary.main'}}>
                    &nbsp;
                    {discount && fCurrency(discount + charge)}
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
    }
    const Variations = (props) => {
        const {...rootProps} = props;
        const handleChange = (e, variation, val) => {
            const clone = {...selectedVariations}
            clone[variation.name] = val;
            setSelectedVariations(clone);
        }

        return (
            <Stack spacing={1} {...rootProps}>
                {variations.map(variation => (
                    <Box key={variation.name}>
                        <Typography>
                            {variation.name}
                        </Typography>
                        <ToggleButtonGroup
                            size='small'
                            exclusive
                            value={selectedVariations[variation.name]}
                            color={'primary'}
                            onChange={(e, val) => handleChange(e, variation, val)}
                        >
                            {variation.variationOptions.map((option, index) => (
                                <ToggleButton
                                    value={index}
                                    key={index}
                                >
                                    {option.name}
                                </ToggleButton>
                            ))}
                        </ToggleButtonGroup>
                    </Box>
                ))}
            </Stack>
        )

    }

    return (
        <>
            <Helmet>
                <title>{name}</title>
            </Helmet>

            <Container>
                <CartWidget/>
                <Typography variant="h4" sx={{mb: 5}}>
                    Product Details
                </Typography>
                <Stack
                    direction={largeScreen ? 'row' : 'column-reverse'}
                    spacing={3}
                    sx={{mb: 5}}
                >
                    {images.length > 0 && <ImageViewer {...imageViewerProps}/>}
                    <Box sx={{flex: 1}}>
                        <ProductName {...{label, name}}/>
                        <Stack
                            direction='row'
                            sx={{alignItems: 'center'}}
                        >
                            <Rating name="read-only" value={3.75} readOnly/>
                            <Typography
                                sx={{color: 'text.disabled'}}
                            >&nbsp;1,273 ratings</Typography>
                        </Stack>
                        <Divider sx={{mb: 3}}/>
                        <Stack spacing={3}>
                            <Prices/>
                            <Variations/>
                            <AddToCart quantity={quantity}/>
                        </Stack>
                    </Box>
                </Stack>
                {description.split('\n').map(paragraph => (
                    <Typography
                        paragraph
                        sx={{textIndent: '20px', textAlign: 'justify'}}
                    >{paragraph}</Typography>
                ))}
            </Container>
        </>
    );
}

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

    const ImageRoll = (props) => {
        return <Stack
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
                    onClick={() => setCurrentImage(id)}
                />
            )}

            {images.length > MAX_DISPLAY_IMAGES && <ChevronButton
                sx={{left: '10px'}}
                onClick={() => changeImageRoll(-1)}
            >
                <ChevronLeftIcon
                    sx={{color: 'white'}}
                />
            </ChevronButton>}
            {images.length > MAX_DISPLAY_IMAGES && <ChevronButton
                sx={{right: '10px'}}
                onClick={() => changeImageRoll(1)}
            >
                <ChevronLeftIcon
                    sx={{
                        transform: 'rotate(180deg)',
                        color: 'white'
                    }}
                />
            </ChevronButton>}
        </Stack>
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
            {images.length > 1 && <ImageRoll/>}
        </Stack>
    </>
}

function ProductName(props) {
    const {name, label, ...rootProps} = props;

    return <Stack {...rootProps} direction='row' spacing={2} sx={{alignItems: 'center'}}>
        <Typography variant="h4">
            {name}
        </Typography>
        <Label
            variant="filled"
            color={(label.name === 'sale' && 'error') || 'info'}
            sx={{
                textTransform: 'uppercase',
            }}
        >
            {label.name}
        </Label>
    </Stack>
}

const AddToCart = (props) => {
    const {quantity, ...rootProps} = props;
    const [currentQuantity, setCurrentQuantity] = useState(1)
    const largeScreen = useMediaQuery(theme => theme.breakpoints.up('md'));
    const handleChangeQuantity = (val) => {
        const newQuantity = currentQuantity + val;
        if (newQuantity > 0 && newQuantity <= quantity) {
            setCurrentQuantity(newQuantity);
        }
    }

    return <Stack
        {...rootProps}
        direction={largeScreen ? 'row' : 'column'}
        spacing={largeScreen ? 4 : 2}
    >
        <Stack direction='row'
               sx={{alignItems: 'center'}}
        >
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
                '&.MuiButtonBase-root': {
                    marginInline: largeScreen ? 'none' : 'auto'
                }
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
        description: 'The Air Force 1 NDSTRKT blends unbelievable comfort with head-turning style and street-ready toughness to create an \'indestructible\' feel. In a nod to traditional work boots, the timeless silhouette comes covered in rubber reinforcements in high-wear areas. Lace up for tough conditions with this hardy take on a lifestyle classic.\nIntroduced in 1982, the Air Force 1 redefined basketball footwear from the hardwood to the tarmac. It was the first basketball sneaker to house Nike Air, but its innovative nature has since taken a back seat to its status as a street icon. ',
        variations: [
            {
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
            {
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
        ]
    }
}
