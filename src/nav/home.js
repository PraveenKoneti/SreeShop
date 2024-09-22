
import { useEffect} from 'react';
import { Link } from "react-router-dom";

const Home = () =>
{

    useEffect(() => {
        const handleTabClose = () => {
            localStorage.removeItem("SreeShoppermit");
            // Additional items to remove from localStorage as needed
        };

        window.addEventListener('beforeunload', handleTabClose);

        return () => {
            window.removeEventListener('beforeunload', handleTabClose);
        };
    }, []);

    return(
        
            <div className="row p-0 m-0">
                <div id="myCarousel" className="carousel slide mb-6 m-0 p-0" data-bs-ride="carousel">
                    <div className="carousel-indicators">
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="1" aria-label="Slide 2"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="2" aria-label="Slide 3"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="3" aria-label="Slide 4"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="4" aria-label="Slide 5"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="5" aria-label="Slide 6"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="6" aria-label="Slide 7"></button>
                        <button type="button" data-bs-target="#myCarousel" data-bs-slide-to="7" aria-label="Slide 8"></button>
                    </div>

                    <div className="carousel-inner">
                        <div className="carousel-item active">
                        <Link to="/womens wear">
                            <img src="images/carousel/fashion.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Women's wear" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/watches">
                            <img src="images/carousel/watch.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Watches" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/head phones">
                            <img src="images/carousel/airpods.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Headphones" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/mobiles">
                            <img src="images/carousel/mobiles.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Mobiles" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/laptops">
                            <img src="images/carousel/laptops.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Laptops" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/footwear">
                            <img src="images/carousel/footwear.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Footwear" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/moisturizers">
                            <img src="images/carousel/moisturizer.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Moisturizers" />
                        </Link>
                        </div>
                        <div className="carousel-item">
                        <Link to="/bags">
                            <img src="images/carousel/lauguage.jpg" className="d-block img-fluid" width="100%" height="auto" alt="Bags" />
                        </Link>
                        </div>
                    </div>

                    <button className="carousel-control-prev" type="button" data-bs-target="#myCarousel" data-bs-slide="prev">
                        <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Previous</span>
                    </button>

                    <button className="carousel-control-next" type="button" data-bs-target="#myCarousel" data-bs-slide="next">
                        <span className="carousel-control-next-icon" aria-hidden="true"></span>
                        <span className="visually-hidden">Next</span>
                    </button>
                </div>


        
                
                <div className='mt-1 mb-1 m-0 p-0'>
                    <img src="images/homedelivery.jpg"  width="100%" height="auto"  className="img-fluid" alt="" /> 
                </div>




                <div className='row m-0 p-0 mb-1 bg-secondary'>
                    <h3 className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 m-auto text-center text-white mt-3 text-decoration-underline p-0'> TOP BRANDS ON TOP DEALS </h3>
                    <div className='col-xl-12 col-lg-12 col-md-12 col-sm-12 col-xxl-12 m-auto'>
                        <div className='row mb-3 pt-3 pb-3 m-1 shadow-lg'>
                            <div className='col-2 m-auto p-1 bg-white'>
                                <div className='m-auto border border-white border-4 '> 
                                    <Link to="/mens wear">  <img src="images/home/clothes.jpg" width="100%" height="auto" className="img-fluid" alt=""  /> </Link>
                                    <h4  className="text-center mt-2">Starting <br/> <i className="fa-solid fa-indian-rupee-sign ms-1"></i> 499 </h4>
                                </div>
                            </div>

                            <div className='col-2 m-auto p-1 bg-white'>
                                <div className='m-auto border border-white border-4 '> 
                                    <Link to="/womens wear">  <img src="images/home/womens.jpg" width="100%" height="auto" className="img-fluid" alt=""  />  </Link>
                                    <h4  className='text-center mt-2'> Starting <br/> <i class="fa-solid fa-indian-rupee-sign ms-1"></i> 699 </h4>
                                </div>
                            </div>

                            <div className='col-2 m-auto p-1 bg-white'>
                                <div className='m-auto border border-white border-4 '> 
                                    <Link to="/footwear">  <img src="images/home/footwear.jpg" width="100%" height="auto" className="img-fluid" alt="" />  </Link>
                                    <h4  className='text-center mt-2'> Starting <br/> <i class="fa-solid fa-indian-rupee-sign ms-1"></i> 499 </h4>
                                </div>
                            </div>

                            <div className='col-2 m-auto p-1 bg-white'>
                                <div className='m-auto border border-white border-4 '> 
                                    <Link to="/mobiles"> <img src="images/home/mobile.jpg" width="100%" height="auto" className="img-fluid" alt="" />  </Link>
                                    <h4  className='text-center mt-2'> Starting <br/> <i class="fa-solid fa-indian-rupee-sign"></i> 5999 </h4>
                                </div>
                            </div>

                            <div className='col-2 m-auto p-1 bg-white'>
                                <div className='m-auto border border-white border-4 '> 
                                    <Link to="/electronic goods">  <img src="images/home/electronicgoods.jpg" width="100%" height="auto" className="img-fluid" alt=""  /> </Link>
                                    <h4  className='text-center fs-auto mt-2'> Starting <br/> <i class="fa-solid fa-indian-rupee-sign ms-1"></i> 499 </h4>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>


                <div className='mt-1 mb-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fluid ' src="images/home/summersale.gif" width="100%" height="auto" alt=""  /> 
                </div>


                <div className='row m-0 p-0 mb-1 m-auto' style={{ backgroundColor: '#183f4e' }}>
                    <div className='col-xl-11 col-xxl-11 col-lg-11 col-md-11 col-sm-11 m-auto'>
                        <div className='row mb-3 pt-2 pb-2 m-1 p-1 shadow-lg m-auto'>
                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2 '> 
                                    <Link to="/laptops">  <img src="images/home/Dell i3.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            <div className='col-3 m-auto p-1 '>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/laptops">  <img src="images/home/acer.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            
                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/laptops">  <img src="images/home/asus.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/laptops">  <img src="images/home/dell.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>
                          
                        </div>
                    </div>
                </div>


                



                <div className='mt-1 mb-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fluid ' src="images/home/showgift.gif" width="100%" height="auto" alt=""  /> 
                </div>



                <div className='mt-1 mb-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fluid ' src="images/home/summercool.jpg" width="100%" height="auto" alt="" /> 
                </div>
                

                <div className='row m-0 p-0 mb-1 homesummercool m-auto'>
                    <div className='col-xl-11 col-xxl-11 col-lg-11 col-md-11 col-sm-11 m-auto'>
                        <div className='row mb-3 pt-2 pb-2 m-1 p-1 shadow-lg m-auto'>
                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2 '> 
                                    <Link to="/mens wear">  <img src="images/home/summercool1.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            <div className='col-3 m-auto p-1 '>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/kids wear">  <img src="images/home/summercool2.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            
                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/womens wear">  <img src="images/home/summercool4.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/mens wear">  <img src="images/home/summercool5.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>
                            

                           
                        </div>
                    </div>
                </div>



                <div className='mt-1 mb-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fluid' src="images/carousel/warmweather.jpg" width="100%" height="auto" alt="" /> 
                </div>




                <div className='m-0 p-0'>
                    <div className='row m-0'>
                        <div className='col-6 m-0 p-0'>
                            <Link to="/mens wear"><img src="images/carousel/warmmen.jpg" className="d-block img-fluid" width="100%" height="auto"  alt="Men's Wear" /></Link>
                        </div>
                        <div className='col-6 m-0 p-0'>
                            <Link to="/womens wear"><img src="images/carousel/warmwomens.jpg" className="d-block img-fluid" width="100%" height="auto"  alt="Women's Wear" /></Link>
                        </div>
                    </div>
                </div>





                <div className='mt-1 mb-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fluid' src="images/home/sbi.jpg" width="100%" height="auto" alt=""  /> 
                </div>
                

                <div className='mt-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fluid' src="images/home/summercools.jpg" width="100%" height="auto" alt=""  /> 
                </div>



                <div className='row p-0 m-0 ' style={{backgroundImage: 'url("images/home/Summergreen.jpg")',width:'100%', height:'height'}}>
                    <div className='col-xl-11 col-xxl-11 col-lg-11 col-md-11 col-sm-11 m-auto'>
                    <div className='row mb-3 pt-2 pb-2 m-1 p-1 shadow-lg m-auto'>
                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2 '> 
                                    <Link to="/electronic goods">  <img src="images/home/ac.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            <div className='col-3 m-auto p-1 '>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/electronic goods">  <img src="images/home/fridge.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            
                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/electronic goods">  <img src="images/home/cooler.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>

                            <div className='col-3 m-auto p-1'>
                                <div className='m-auto bg-white p-2'> 
                                    <Link to="/electronic goods">  <img src="images/home/washingmachine.jpg" width="100%" height="auto" className="img-fluid" alt="" /> </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>




                <div className='mt-1 mb-1 me-0 ms-0 p-0'>
                    <img className='pe-0 img-fulid' src="images/home/curatedsummer.jpg" width="100%" height="auto" alt=""  /> 
                </div>
                




                <div className='row m-0 p-0'>
                    <div className='col-sm-11 m-auto'>
                        <div className='row m-1 p-0 shadow-lg'>
                            <div className="col-4 m-auto p-auto">
                                <Link to="/mens wear">  <img src="images/home/trending1.jpg" width="100%" height="auto" className='img-fluid' alt="" /> </Link>
                            </div>

                            <div className="col-4 m-auto p-auto">
                                <Link to="/kids wear">  <img src="images/home/trending2.jpg" width="100%" height="auto" className='img-fluid' alt="" /> </Link>
                            </div>

                            <div className="col-4 m-auto p-auto">
                                <Link to="/womens wear">  <img src="images/home/trending3.jpg" width="100%" height="auto" className='img-fluid' alt="" /> </Link>
                            </div>

                        </div>
                    </div>
                </div>

            </div> 

             

    )
}

export default Home;